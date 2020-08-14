import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { validator } from '@ioc:Adonis/Core/Validator'

import User from 'App/Models/User'

import jwt from 'jsonwebtoken'
import config from '@ioc:Adonis/Core/Config'

import Event from '@ioc:Adonis/Core/Event'

import { UserRegisterParams, UserLoginParams, UserUpdatePasswordParams, ApiAuthParams } from 'App/Typings/Auth'

import LoginValidator from 'App/Validators/Auth/Login'
import RegisterValidator from 'App/Validators/Auth/Register'
import LoginApiValidator from 'App/Validators/Auth/LoginApi'

import UnauthorizedException from 'App/Exceptions/UnAuthorizedException'
import InvalidCredentialException from 'App/Exceptions/InvalidCredentialException'

export default class AuthService {
  public async register (params: UserRegisterParams) {
    const registerValidation = new RegisterValidator()

    await validator.validate({
      schema: registerValidation.schema,
      data: params,
      messages: registerValidation.messages,
    })

    const user = await User.create({
      username: params.username,
      emailAddress: params.emailAddress,
      password: params.password,
    })

    Event.emit('user:registration', user)

    return user
  }

  public async login (params: UserLoginParams) {
    const loginValidaton = new LoginValidator()

    await validator.validate({
      schema: loginValidaton.schema,
      data: params,
      messages: loginValidaton.messages,
    })

    const user = await User.query()
      .where({emailAddress: params.emailAddress})
      .first()

    if (!user) {
      throw new InvalidCredentialException('Invalid credentials')
    }

    if (!(await user.checkPassword(params.password))) {
      throw new InvalidCredentialException('Invalid credentials')
    }

    const token = this.createToken(user)

    return token
  }

  public async me (user :User) {
    if (!user) {
      throw new UnauthorizedException('Unauthorized')
    }

    console.log(user)

    return user
  }

  public async updatePassword (params: UserUpdatePasswordParams, user: User) {
    if (!user) {
      throw new UnauthorizedException('Unauthorized')
    }

    if (!(await user.checkPassword(params.oldPassword))) {
      throw new InvalidCredentialException('Invalid credentials')
    }

    user.password = params.password

    await user.save()

    return user
  }

  private createToken (user: User) {
    const secret = config.get('jwt').appKey
    const expiresIn = config.get('jwt').expiresIn
    const payload = {
      iss: config.get('jwt').appName,
      sub: user.uuid,
    }

    const token = {
      expiresIn: expiresIn,
      token: jwt.sign(payload, secret, {expiresIn}),
    }
    return token
  }

  public async createApiToken (params: ApiAuthParams, auth: HttpContextContract['auth']){
    const loginApiValidation = new LoginApiValidator()

    await validator.validate({
      schema: loginApiValidation.schema,
      data: params,
      messages: loginApiValidation.messages,
    })

    const user = await User.query()
      .where({username: params.username})
      .first()

    if(!user){
      throw new InvalidCredentialException('Invalid credentials')
    }

    if(!user.checkApiKey(params.apiKey)){
      throw new InvalidCredentialException('Invalid credentials')
    }

    const token = await auth.login(user)

    return token
  }

  public async deleteApiToken (auth: HttpContextContract['auth']){
    const token = await auth.logout(auth.user)

    console.log(token)

    return token
  }
}

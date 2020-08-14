import { validator } from '@ioc:Adonis/Core/Validator'

import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'

import User from 'App/Models/User'
import Token, { TokenTypeEnum } from 'App/Models/Token'

import { v4 as uuid } from 'uuid'

import Event from '@ioc:Adonis/Core/Event'

import { UserResetParams } from 'App/Typings/Auth'

import NotFoundException from 'App/Exceptions/NotFoundException'
import BadRequestException from 'App/Exceptions/BadRequestException'

import ResetPasswordValidator from 'App/Validators/Auth/ResetPassword'

export default class RecoveryService {
  public async initUserResetPassword (emailAddress: string) {
    if(!emailAddress){
      throw new BadRequestException('email_address not provided')
    }

    const user = await User.query()
      .where({emailAddress})
      .first()

    if (!user) {
      throw new NotFoundException('User not found')
    }

    Event.emit('user:recovery', user)

    return user
  }

  public async createUserResetPasswordToken (user: User) {
    if (!user) {
      throw new NotFoundException('User not found')
    }

    const token = await user.related('tokens')
      .create({
        token: uuid(),
        type: TokenTypeEnum.RESET,
      })

    return token
  }

  public async resetUserPassword (params: UserResetParams) {
    const resetPasswordValidation = new ResetPasswordValidator()

    await validator.validate({
      schema: resetPasswordValidation.schema,
      data: params,
      messages: resetPasswordValidation.messages,
    })

    const resetToken = await Token.query()
      .where({
        token: params.token,
        type: TokenTypeEnum.RESET,
      })
      .first()

    if (!resetToken) {
      throw new NotFoundException('Token not found')
    }

    if (resetToken.expired()) {
      throw new NotFoundException('Token expired')
    }

    const user = await resetToken.related('user')
      .query()
      .firstOrFail()

    if (!user) {
      throw new NotFoundException('User not found')
    }

    user.password = params.password

    await user.save()

    await resetToken.delete()

    return user
  }

  public async sendUserResetPasswordMail (user: User, token: Token) {
    if (!token) {
      throw new NotFoundException('Token not provided')
    }

    if (!user) {
      throw new NotFoundException('User not provided')
    }

    const data = {
      domain: Env.get('DOMAIN_NAME'),
      token: token,
    }

    const mail = await Mail.send((message) => {
      message
        .from('noreply@upnance.com', 'Upnance')
        .to(user.emailAddress)
        .subject('Password reset for your Upnance account')
        .htmlView('emails/recovery', data)
    })

    return mail
  }
}

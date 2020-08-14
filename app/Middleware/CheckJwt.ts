import jwt from 'jsonwebtoken'
import config from '@ioc:Adonis/Core/Config'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UnauthorizedException from 'App/Exceptions/UnAuthorizedException'

import User from 'App/Models/User'

export default class CheckJwt {
  public async handle ({request, auth}: HttpContextContract, next: () => Promise<void>) {
    const {authorization} = request.headers()

    if (!authorization) {
      throw new UnauthorizedException('Missing JWT Token')
    }

    const [, token] = authorization.split(' ')

    const secret = config.get('jwt').appKey as string

    try {
      const payload = jwt.verify(token, secret)
      const user = await User.findByOrFail('uuid', payload.sub)

      const apit = await auth.login(user)
      console.log(apit)
    } catch {
      throw new UnauthorizedException('Invalid JWT Token')
    }

    await next()
  }
}

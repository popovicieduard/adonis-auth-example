import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'

import User from 'App/Models/User'
import Token, { TokenTypeEnum } from 'App/Models/Token'

import { v4 as uuid } from 'uuid'

import UnauthorizedException from 'App/Exceptions/UnAuthorizedException'
import NotFoundException from 'App/Exceptions/NotFoundException'

export default class ConfirmationService {
  public async createUserConfirmationToken (user: User) {
    if (!user) {
      throw new UnauthorizedException('Unauthorized')
    }

    const token = await user.related('tokens')
      .create({
        token: uuid(),
        type: TokenTypeEnum.CONFIRM,
      })

    return token
  }

  public async confirmUser (token: string) {
    if (!token) {
      throw new UnauthorizedException('Unauthorized')
    }

    const confirmToken = await Token.query()
      .where({
        token,
        type: TokenTypeEnum.CONFIRM,
      })
      .first()

    if (!confirmToken) {
      throw new NotFoundException('Token not found')
    }

    if (confirmToken.expired()) {
      throw new NotFoundException('Token expired')
    }

    const user = await confirmToken.related('user')
      .query()
      .first()

    if (!user) {
      throw new NotFoundException('User not found')
    }

    user.isVerified = true

    await user.save()

    await confirmToken.delete()

    return user
  }

  public async sendUserConfirmationMail (user: User, token: Token) {
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
        .subject('Email verification for your Upnance account')
        .htmlView('emails/confirmation', data)
    })

    return mail
  }
}

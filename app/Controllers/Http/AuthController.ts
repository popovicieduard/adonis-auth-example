import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import AuthService from 'App/Services/Auth/AuthService'
import RecoveryService from 'App/Services/Auth/RecoveryService'
import ConfirmationService from 'App/Services/Auth/ConfirmationService'

import NotFoundException from 'App/Exceptions/NotFoundException'

export default class AuthController {
  async register ({ request, response }: HttpContextContract) {
    try {
      const { username, emailAddress, password, passwordConfirmation } = request.post()

      const user = await new AuthService().register({ username, emailAddress, password, passwordConfirmation })

      return response.json(user)
    } catch (error) {
      throw error
    }
  }

  async login ({ request, response }: HttpContextContract) {
    try {
      const { emailAddress, password } = request.post()
      const token = await new AuthService().login({ emailAddress, password })
      return response.json(token)
    } catch (error) {
      throw error
    }
  }

  async me ({ auth, response }: HttpContextContract) {
    try {
      if(!auth.user){
        throw new NotFoundException('User not found')
      }

      const user = await new AuthService().me(auth.user)

      return response.json(user)
    } catch (error) {
      throw error
    }
  }

  async initUserResetPassword ({ request, response }: HttpContextContract) {
    try {
      const { emailAddress } = request.post()
      const user = await new RecoveryService().initUserResetPassword(emailAddress)
      return response.json(user)
    } catch (error) {
      throw error
    }
  }

  async resetUserPassword ({ request, params, response }: HttpContextContract) {
    try {
      const { token } = params

      const { password, passwordConfirmation } = request.post()

      const user = await new RecoveryService().resetUserPassword({ password, passwordConfirmation, token })
      return response.json(user)
    } catch (error) {
      throw error
    }
  }

  async createUserConfirmationToken ({ auth, response }: HttpContextContract) {
    try {
      const user = auth.user

      if(!user){
        throw new NotFoundException('User not found')
      }

      await new ConfirmationService().createUserConfirmationToken(user)

      return response.json({ message: 'ok' })
    } catch (error) {
      throw error
    }
  }

  async confirmUser ({ params, response }: HttpContextContract) {
    try {
      const { token } = params

      const user = await new ConfirmationService().confirmUser(token)

      return response.json(user)
    } catch (error) {
      throw error
    }
  }

  async updatePassword ({ request, auth, response }: HttpContextContract) {
    try {
      const { oldPassword, password, passwordConfirmation } = request.all()

      if(!auth.user){
        throw new NotFoundException('User not found')
      }

      const user = await new AuthService().updatePassword({ oldPassword, password, passwordConfirmation }, auth.user)
      return response.json(user)
    } catch (error) {
      throw error
    }
  }

  async createApiToken ({ request, auth, response }: HttpContextContract) {
    try {
      const { username, apiKey } = request.post()

      const user = await new AuthService().createApiToken({ username, apiKey }, auth)

      return response.json(user)
    } catch (error) {
      throw error
    }
  }

  async deleteApiToken ({ response, auth }: HttpContextContract) {
    try {
      const token = await new AuthService().deleteApiToken(auth)

      return response.json(token)
    } catch (error) {
      throw error
    }
  }
}

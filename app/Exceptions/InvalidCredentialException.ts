import { Exception } from '@poppinss/utils'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@poppinss/utils` allows defining
| a status code and error code for every exception.
|
| @example
| new InvalidCredentialException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class InvalidCredentialException extends Exception {
  constructor (message: string) {
    super(message, 400, 'E_INVALID_CREDENTIALS')
  }

  /**
     * Implement the handle method to manually handle this exception.
     * Otherwise it will be handled by the global exception handler.
     */
  public async handle (error: this, { response }: HttpContextContract) {
    response
      .status(error.status)
      .json({
        error_status: this.status,
        error_code: this.code,
        error_message: this.message.split(': ')[1],
      })
  }
}

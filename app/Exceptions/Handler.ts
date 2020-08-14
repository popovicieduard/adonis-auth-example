import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import snakeize from 'snakecase-keys'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor () {
    super(Logger)
  }

  public async handle (error, ctx: HttpContextContract) {
    switch (error.code) {
      case 'E_VALIDATION_FAILUDE':
        return ctx.response.status(422)
          .json({
            error_status: error.status,
            error_code: error.code,
            error_message: snakeize(error.messages),
          })
      default:
        break
    }

    return super.handle(error, ctx)
  }
}

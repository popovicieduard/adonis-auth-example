import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import camelCase from 'camelcase-keys'

/**
 * Silent auth middleware can be used as a global middleware to silent check
 * if the user is logged-in or not.
 *
 * The request continues as usual, even when the user is not logged-in.
 */
export default class CamelCaseRequest {
  /**
   * Handle request
   */
  public async handle ({ request }: HttpContextContract, next: () => Promise<void>) {
    /**
     * Check if user is logged-in or not. If yes, then `ctx.auth.user` will be
     * set to the instance of the currently logged in user.
     */

    request.updateQs(camelCase(request.get()))
    request.updateBody(camelCase(request.post()))    

    await next()
  }
}

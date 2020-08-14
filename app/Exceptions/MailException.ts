export default class MailException {
  private _message: string
  private _code: string
  private _status: number
  private _error: any

  constructor (message: string, error: any) {
    this._message = message
    this._code = 'E_EMAIL'
    this._status = 400
    this._error = error

    this.handle()
    this.report()
  }

  /**
     * Implement the handle method to manually handle this exception.
     * Otherwise it will be handled by the global exception handler.
     */
  public async handle () {

  }

  public async report () {

  }
}

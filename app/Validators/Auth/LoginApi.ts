import { rules, schema } from '@ioc:Adonis/Core/Validator'

export default class LoginApiValidator {
  public schema = schema.create({
    username: schema.string({}, [
      rules.required(),
      rules.alpha(),
      rules.minLength(4),
      rules.maxLength(60),
    ]),
    apiKey: schema.string({}, [
      rules.required(),
      rules.minLength(4),
      rules.maxLength(64),
    ]),
  })

  public messages = {
    'username.required': 'username is required',
    'username.alpha': 'username must include only alphabetical characters',
    'username.minLength': 'username must be minimum {{ options.minLength }} characters',
    'username.maxLength': 'username must be maximum {{ options.maxLength }} characters',
    'apiKey.required': 'email address is required',
    'apiKey.minLength': 'email address must be minimum {{ options.minLength }} characters',
    'apiKey.maxLength': 'email address must be maximum {{ options.maxLength }} characters',
  }
}

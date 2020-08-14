import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class LoginValidator {
    public schema = schema.create({
        emailAddress: schema.string({}, [
            rules.required(),
            rules.email(),
            rules.minLength(4),
            rules.maxLength(120)
        ]),
        password: schema.string({}, [
            rules.required(),
            rules.minLength(8),
            rules.maxLength(60)
        ]),
    })

    public messages = {
        'emailAddress.required': 'email address is required',
        'emailAddress.minLength': 'email address must be minimum {{ options.minLength }} characters',
        'emailAddress.maxLength': 'email address must be maximum {{ options.maxLength }} characters',
        'password.required': 'password is required',
        'password.minLength': 'password must be minimum {{ options.minLength }} characters',
        'password.maxLength': 'password must be maximum {{ options.maxLength }} characters',
    }
}

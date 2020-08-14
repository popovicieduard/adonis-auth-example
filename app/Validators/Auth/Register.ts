import { rules, schema } from '@ioc:Adonis/Core/Validator'

export default class RegisterValidator {
    public schema = schema.create({
        username: schema.string({}, [
            rules.required(),
            rules.alpha(),
            rules.unique({ table: 'users', column: 'username' }),
            rules.minLength(4),
            rules.maxLength(60)
        ]),
        emailAddress: schema.string({}, [
            rules.required(),
            rules.email(),
            rules.unique({ table: 'users', column: 'email_address' }),
            rules.minLength(4),
            rules.maxLength(120)
        ]),
        password: schema.string({}, [
            rules.required(),
            rules.confirmPassword({ onField: 'passwordConfirmation' }),
            rules.minLength(8),
            rules.maxLength(60)
        ]),
        passwordConfirmation: schema.string({}, [
            rules.required(),
            rules.minLength(8),
            rules.maxLength(60)
        ]),
    })

    public messages = {
        'username.required': 'username is required',
        'username.alpha': 'username must include only alphabetical characters',
        'username.unique': 'username must be unique',
        'username.minLength': 'username must be minimum {{ options.minLength }} characters',
        'username.maxLength': 'username must be maximum {{ options.maxLength }} characters',
        'emailAddress.required': 'email address is required',
        'emailAddress.unique': 'email address must be unique',
        'emailAddress.minLength': 'email address must be minimum {{ options.minLength }} characters',
        'emailAddress.maxLength': 'email address must be maximum {{ options.maxLength }} characters',
        'password.required': 'password is required',
        'password.confirmPassword': 'password must match password confirmation',
        'password.minLength': 'password must be minimum {{ options.minLength }} characters',
        'password.maxLength': 'password must be maximum {{ options.maxLength }} characters',
        'passwordConfirmation.required': 'password confirmation is required',
        'passwordConfirmation.minLength': 'password confirmation must be minimum {{ options.minLength }} characters',
        'passwordConfirmation.maxLength': 'password confirmation must be maximum {{ options.maxLength }} characters',
    }
}
import { rules, schema } from '@ioc:Adonis/Core/Validator'

export default class ResetPasswordValidator {
    public schema = schema.create({
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
        'password.required': 'password is required',
        'password.confirmPassword': 'password must match password confirmation',
        'password.minLength': 'password must be minimum {{ options.minLength }} characters',
        'password.maxLength': 'password must be maximum {{ options.maxLength }} characters',
        'passwordConfirmation.required': 'password confirmation is required',
        'passwordConfirmation.minLength': 'password confirmation must be minimum {{ options.minLength }} characters',
        'passwordConfirmation.maxLength': 'password confirmation must be maximum {{ options.maxLength }} characters',
    }
}
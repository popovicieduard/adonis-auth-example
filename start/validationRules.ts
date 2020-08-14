import { validator } from '@ioc:Adonis/Core/Validator'

const DEFAULT_SUFIX = 'Confirmation'

validator.rule('confirmPassword', (value, _:any, { field, arrayExpressionPointer, errorReporter, root, tip }) => {
    /**
     * Skip validation when value is not a string. The string
     * schema rule will handle it 
     */
    if (typeof (value) !== 'string') {
        return
    }
    
    let options = _[0]

    var onField = field + DEFAULT_SUFIX

    if(options.onField){
        onField = options.onField
    }

    if (!value) {
        return
    }

    const confirmed = validator.helpers.getFieldValue(onField, root, tip)

    if (value != confirmed) {
        errorReporter.report(onField, 'confirmPassword', 'password confirmation validation failed', arrayExpressionPointer)
        return
    }
})
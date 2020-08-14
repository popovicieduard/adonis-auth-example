import { EventsList } from '@ioc:Adonis/Core/Event'

import MailException from 'App/Exceptions/MailException'

import ConfirmationService from 'App/Services/Auth/ConfirmationService'
import RecoveryService from 'App/Services/Auth/RecoveryService'

export default class User {
    public async userRegistration(user: EventsList['user:registration']) {
        try {
            const confirmationService = new ConfirmationService()
            const token = await confirmationService.createUserConfirmationToken(user)
            await confirmationService.sendUserConfirmationMail(user, token)
            return
        } catch (error) {
            new MailException('Confirmation mail failed', error)
        }
    }

    public async userRecovery(user: EventsList['user:recovery']) {
        try {
            const recoveryService = new RecoveryService()
            const token = await recoveryService.createUserResetPasswordToken(user)
            await recoveryService.sendUserResetPasswordMail(user, token)
            return
        } catch (error) {
            new MailException('Confirmation mail failed', error)
        }
    }
}

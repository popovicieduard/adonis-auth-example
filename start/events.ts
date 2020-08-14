import Event from '@ioc:Adonis/Core/Event'

Event.on('user:registration', 'User.userRegistration')
Event.on('user:recovery', 'User.userRecovery')

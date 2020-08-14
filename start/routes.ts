/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import View from '@ioc:Adonis/Core/View'
import Token from 'App/Models/Token'

Route.group(() => {
  // Auth Group
  Route.group(() => {
    Route.post('login', 'AuthController.login')
    Route.post('register', 'AuthController.register')

    Route.post('confirmation/send', 'AuthController.createUserConfirmationToken').middleware('jwt')
    Route.post('confirmation/:token', 'AuthController.confirmUser')

    Route.post('recovery/send', 'AuthController.initUserResetPassword')
    Route.post('recovery/:token', 'AuthController.resetUserPassword')

    Route.get('me', 'AuthController.me').middleware('jwt')

    Route.patch('update-password', 'AuthController.updatePassword').middleware('jwt')
  }).prefix('auth')

  Route.post('login', 'AuthController.createApiToken')
  Route.post('logout', 'AuthController.deleteApiToken').middleware('auth')
}).prefix('api')

Route.get('/api/test', async ()=> {
  const token = new Token()

  token.related('user').query()

  return View.render('emails/confirmation')
})

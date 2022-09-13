import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import RegisterValidator from 'App/Validators/RegisterValidator'

export default class AuthController {
  public async register({ request, auth, response }: HttpContextContract) {
    const payload = await request.validate(RegisterValidator)

    const user = await User.create(payload)
    await auth.login(user)
    return response.status(201).send(user)
  }

  public async login({ request, auth, response }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password'])

    const user = await auth.attempt(email, password)
    return response.status(200).send(user)
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.logout()
    return response.status(200).send({ message: 'Logout successful' })
  }

  public async isAuthenticated({ auth, response }: HttpContextContract) {
    const user = await auth.authenticate()
    const login = auth.isAuthenticated
    return response.status(200).send({ user, login })
  }
}

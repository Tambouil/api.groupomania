import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserValidator from 'App/Validators/UserValidator'
import User from 'App/Models/User'
import Drive from '@ioc:Adonis/Core/Drive'

export default class UsersController {
  public async editUser({ request, response, params, bouncer }: HttpContextContract) {
    const { id } = params
    const user = await User.findOrFail(id)
    await bouncer.authorize('editUser', user)

    const payload = await request.validate(UserValidator)
    const avatar = request.file('avatarFile')

    if (avatar) {
      if (user.avatar) {
        await Drive.delete(user.avatar)
      }
      await avatar.moveToDisk('./users')
    }

    await user.merge({ ...payload, ...(avatar && { avatar: `users/${avatar.fileName}` }) }).save()

    return response.status(200).send({ message: 'User updated' })
  }

  public async deleteUser({ response, params, bouncer }: HttpContextContract) {
    const { id } = params
    const user = await User.findOrFail(id)

    await bouncer.authorize('deleteUser', user)
    if (user.avatar) {
      await Drive.delete(user.avatar)
    }
    await user.delete()

    return response.status(200).send({ message: 'User deleted' })
  }
}

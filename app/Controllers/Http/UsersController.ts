import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserValidator from 'App/Validators/UserValidator'
import User from 'App/Models/User'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'

export default class UsersController {
  public async getUserbyId({ params, response }: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    return response.status(200).send(user)
  }

  public async editUser({ request, response, params, bouncer }: HttpContextContract) {
    const { id } = params
    const user = await User.findOrFail(id)
    await bouncer.authorize('editUser', user)

    const payload = await request.validate(UserValidator)
    const avatar = request.file('avatarFile', {
      size: '2mb',
      extnames: ['jpg', 'JPG', 'png', 'PNG', 'jpeg', 'gif', 'webp'],
    })
    if (avatar) {
      if (!avatar.isValid) {
        return avatar.errors
      }
      user.avatar = Attachment.fromFile(avatar)
    }

    await user.merge(payload, avatar).save()
    return response.status(200).send({ message: 'User updated' })
  }

  public async deleteAvatar({ response, params, bouncer }: HttpContextContract) {
    const { id } = params
    const user = await User.findOrFail(id)
    await bouncer.authorize('editUser', user)

    user.avatar = null
    await user.save()
    return response.status(200).send({ message: 'Avatar deleted' })
  }

  public async deleteUser({ response, params, bouncer }: HttpContextContract) {
    const { id } = params
    const user = await User.findOrFail(id)
    await bouncer.authorize('deleteUser', user)

    await user.delete()
    return response.status(200).send({ message: 'User deleted' })
  }
}

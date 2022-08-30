import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class FollowsController {
  public async followUser({ response, auth, params }: HttpContextContract) {
    const user = auth.user
    const { id } = params

    const isFollowing = await user.related('follows').query().where('followingId', id).first()

    if (isFollowing) {
      isFollowing.delete()
      return response.ok({ message: 'User unfollowed' })
    } else {
      if (user.id === Number(id)) {
        return response.badRequest({ message: 'You cannot follow yourself' })
      }
      const follow = await user.related('follows').create({ userId: user.id, followingId: id })
      return response.created({ follow })
    }
  }
}

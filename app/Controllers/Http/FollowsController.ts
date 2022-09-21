import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from '../../Models/User'

export default class FollowsController {
  public async followUser({ response, auth, params }: HttpContextContract) {
    const user = auth.user
    const { id } = params

    const isFollowing = await user.related('follows').query().where('followingId', id).first()

    if (isFollowing) {
      isFollowing.delete()
      return response.ok(isFollowing)
    } else {
      if (user.id === Number(id)) {
        return response.badRequest({ message: 'You cannot follow yourself' })
      }
      const follow = await user
        .related('follows')
        .create({ userId: user.id, followingId: Number(id) })
      return response.ok(follow)
    }
  }

  public async getFollowers({ response, params }: HttpContextContract) {
    const { id } = params
    const user = await User.findOrFail(id)
    const followers = await user.related('follows').query().preload('user')
    return response.ok(followers)
  }
}

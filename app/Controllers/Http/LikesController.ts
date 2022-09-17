import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Like from '../../Models/Like'

export default class LikesController {
  public async likePost({ response, auth, params }: HttpContextContract) {
    const user = auth.user
    const unLike = await user.related('likes').query().where('postId', params.postId).first()

    if (unLike) {
      unLike.delete()
      return response.ok(unLike)
    } else {
      const like = await user.related('likes').create({ postId: params.postId })
      return response.ok(like)
    }
  }

  public async getLikes({ response, params }: HttpContextContract) {
    const likes = await Like.query().where('postId', params.postId)
    return response.ok(likes)
  }
}

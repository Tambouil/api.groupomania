import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LikesController {
  public async likePost({ response, auth, params }: HttpContextContract) {
    const user = auth.user
    const like = await user.related('likes').query().where('postId', params.postId).first()

    if (like) {
      like.delete()
      return response.ok({ message: 'Post unliked' })
    } else {
      await user.related('likes').create({ postId: params.postId })
      return response.ok({ message: 'Post liked' })
    }
  }
}

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Comment from 'App/Models/Comment'
import CommentValidator from 'App/Validators/CommentValidator'

export default class CommentsController {
  public async addComment({ request, response, auth, params }: HttpContextContract) {
    await auth.authenticate()
    const userId = auth.user.id

    const { postId } = params
    const { content } = request.body()

    const newComment = await Comment.create({
      content,
      postId,
      userId,
    })

    return response.status(201).json(newComment)
  }

  public async editComment({ request, response, params, bouncer }: HttpContextContract) {
    const { id } = params
    const comment = await Comment.findOrFail(id)
    const content = await request.validate(CommentValidator)

    await bouncer.authorize('editComment', comment)
    await comment.merge(content).save()

    return response.status(200).json(comment)
  }

  public async deleteComment({ response, params, bouncer }: HttpContextContract) {
    const { id } = params
    const comment = await Comment.findOrFail(id)
    await bouncer.authorize('deletePost', comment)
    await comment.delete()

    return response.status(200).json(comment)
  }

  public async getAllComments({ response }: HttpContextContract) {
    const comments = await Comment.all()

    return response.status(200).json(comments)
  }
}

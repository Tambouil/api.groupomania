import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'
import PostValidator from 'App/Validators/PostValidator'
import Drive from '@ioc:Adonis/Core/Drive'

export default class PostsController {
  public async createPost({ request, response, auth }: HttpContextContract) {
    await auth.authenticate()
    const userId = auth.user.id
    const payload = await request.validate(PostValidator)
    const thumbnail = request.file('thumbnail_file')
    if (thumbnail) {
      await thumbnail.moveToDisk('./posts')
    }
    await Post.create({
      ...payload,
      userId,
      ...(thumbnail && { thumbnail: `posts/${thumbnail.fileName}` }),
    })

    return response.status(201).send({ message: 'Post created' })
  }

  public async getAllPosts({ response }: HttpContextContract) {
    const posts = await Post.all()
    return response.status(200).send(posts)
  }

  public async editPost({ request, response, params, bouncer }: HttpContextContract) {
    const { id } = params
    const post = await Post.findOrFail(id)
    await bouncer.authorize('isAuthorized', post)

    const payload = await request.validate(PostValidator)
    const thumbnail = request.file('thumbnail_file')
    if (thumbnail) {
      if (post.thumbnail) {
        await Drive.delete(post.thumbnail)
      }
      await thumbnail.moveToDisk('./posts')
    }

    await post
      .merge({ ...payload, ...(thumbnail && { thumbnail: `posts/${thumbnail.fileName}` }) })
      .save()

    return response.status(200).send({ message: 'Post updated' })
  }

  public async deletePost({ response, params, bouncer }: HttpContextContract) {
    const { id } = params
    const post = await Post.findOrFail(id)
    await bouncer.authorize('isAuthorized', post)
    if (post.thumbnail) {
      await Drive.delete(post.thumbnail)
    }
    await post.delete()

    return response.status(200).send({ message: 'Post deleted' })
  }
}

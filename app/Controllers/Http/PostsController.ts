import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from '../../Models/Post'
import PostValidator from '../../Validators/PostValidator'
import Drive from '@ioc:Adonis/Core/Drive'

export default class PostsController {
  public async createPost({ request, response }: HttpContextContract) {
    const payload = await request.validate(PostValidator)
    const thumbnail = request.file('thumbnail_file')
    if (thumbnail) {
      await thumbnail.moveToDisk('./posts')
    }
    await Post.create({
      ...payload,
      ...(thumbnail && { thumbnail: `posts/${thumbnail.fileName}` }),
    })

    return response.status(201).send({ message: 'Post created' })
  }

  public async getAllPosts({ response }: HttpContextContract) {
    const posts = await Post.all()
    return response.status(200).send(posts)
  }

  public async editPost({ request, response, params }: HttpContextContract) {
    const { id } = params
    const payload = await request.validate(PostValidator)
    const post = await Post.findOrFail(id)

    if (!post) {
      return
    }

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

  public async deletePost({ response, params }: HttpContextContract) {
    const { id } = params
    const post = await Post.findOrFail(id)
    await post.delete()

    return response.status(200).send({ message: 'Post deleted' })
  }
}

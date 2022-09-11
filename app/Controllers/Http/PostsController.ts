import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'
import PostValidator from 'App/Validators/PostValidator'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'

export default class PostsController {
  public async createPost({ request, response, auth }: HttpContextContract) {
    await auth.authenticate()
    const userId = auth.user.id
    const payload = await request.validate(PostValidator)
    const thumbnail = request.file('thumbnailFile', {
      size: '2mb',
      extnames: ['jpg', 'JPG', 'png', 'PNG', 'jpeg', 'gif', 'webp'],
    })

    const newPost = await Post.create({
      ...payload,
      userId,
    })

    if (thumbnail) {
      if (!thumbnail.isValid) {
        return thumbnail.errors
      }
      newPost.thumbnail = Attachment.fromFile(thumbnail)
      await newPost.save()
    }
    return response.status(201).send(newPost)
  }

  public async getAllPosts({ response }: HttpContextContract) {
    const posts = await Post.all()
    return response.status(200).send(posts)
  }

  public async editPost({ request, response, params, bouncer }: HttpContextContract) {
    const { id } = params
    const post = await Post.findOrFail(id)
    await bouncer.authorize('editPost', post)

    const payload = await request.validate(PostValidator)
    const thumbnail = request.file('thumbnailFile', {
      size: '2mb',
      extnames: ['jpg', 'JPG', 'png', 'PNG', 'jpeg', 'gif', 'webp'],
    })
    if (thumbnail) {
      if (!thumbnail.isValid) {
        return thumbnail.errors
      }
      post.thumbnail = Attachment.fromFile(thumbnail)
    }

    await post.merge(payload, thumbnail).save()
    return response.status(200).send(post)
  }

  public async deleteThumbnail({ response, params, bouncer }: HttpContextContract) {
    const { id } = params
    const post = await Post.findOrFail(id)
    await bouncer.authorize('editPost', post)

    post.thumbnail = null
    await post.save()
    return response.status(200).send(post)
  }

  public async deletePost({ response, params, bouncer }: HttpContextContract) {
    const { id } = params
    const post = await Post.findOrFail(id)
    await bouncer.authorize('deletePost', post)

    await post.delete()
    return response.status(200).send(post)
  }
}

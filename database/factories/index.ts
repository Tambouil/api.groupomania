import Factory from '@ioc:Adonis/Lucid/Factory'
import User from 'App/Models/User'
import Post from 'App/Models/Post'
import { Role } from 'App/Enums/Roles'
import Comment from 'App/Models/Comment'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import Drive from '@ioc:Adonis/Core/Drive'
import { file } from '@ioc:Adonis/Core/Helpers'

export const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: 'secret',
  }
})
  .state('admin', (user) => {
    user.role = Role.ADMIN
  })
  .relation('posts', () => PostFactory)
  .build()

export const PostFactory = Factory.define(Post, async ({ faker }) => {
  /**
   * Step 1: Create an instance of attachment
   */
  const thumbnail = new Attachment({
    extname: 'png',
    mimeType: 'image/png',
    size: 10 * 1000,
    name: `${faker.random.alphaNumeric(10)}.png`,
  })

  /**
   * Step 2: Mark image as persisted, this will disable the
   * functions of attachment lite that looks for multipart
   * body and attempts to write the file from the stream
   */
  thumbnail.isPersisted = true

  /**
   * Step 3: Persist the file using Drive.
   */
  await Drive.put(`posts/${thumbnail.name}`, (await file.generatePng('1mb')).contents)
  return {
    content: faker.lorem.words(),
    thumbnail,
  }
})
  .relation('comments', () => CommentFactory)
  .build()

export const CommentFactory = Factory.define(Comment, ({ faker }) => {
  return {
    content: faker.lorem.words(),
  }
}).build()

import Factory from '@ioc:Adonis/Lucid/Factory'
import User from 'App/Models/User'
import Post from 'App/Models/Post'
import { Role } from 'App/Enums/Roles'
import Comment from 'App/Models/Comment'

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

export const PostFactory = Factory.define(Post, ({ faker }) => {
  return {
    content: faker.lorem.words(),
    thumbnail: faker.image.imageUrl(),
  }
})
  .relation('comments', () => CommentFactory)
  .build()

export const CommentFactory = Factory.define(Comment, ({ faker }) => {
  return {
    content: faker.lorem.words(),
  }
}).build()

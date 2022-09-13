/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

Route.group(() => {
  // Health Check
  Route.get('health', async ({ response }) => {
    const report = await HealthCheck.getReport()

    return report.healthy ? response.ok(report) : response.badRequest(report)
  })
  Route.group(() => {
    // AUTH
    Route.post('/login', 'AuthController.login')
    Route.post('/register', 'AuthController.register')
    Route.post('/logout', 'AuthController.logout').middleware('auth')
    Route.get('/me', 'AuthController.isAuthenticated')
  }).prefix('auth')
  Route.group(() => {
    // USER
    Route.group(() => {
      Route.get('/', 'UsersController.getUserbyId')
      Route.patch('/', 'UsersController.editUser')
      Route.delete('/avatar', 'UsersController.deleteAvatar')
      Route.delete('/', 'UsersController.deleteUser')
      Route.post('/follow', 'FollowsController.followUser')
    }).prefix('/users/:id')

    // POSTS
    Route.get('/posts', 'PostsController.getAllPosts')
    Route.post('/posts', 'PostsController.createPost')
    Route.patch('/posts/:id', 'PostsController.editPost')
    Route.delete('/posts/:id/thumbnail', 'PostsController.deleteThumbnail')
    Route.delete('/posts/:id', 'PostsController.deletePost')

    Route.group(() => {
      // COMMENTS
      Route.post('/comments', 'CommentsController.addComment')
      Route.patch('/comments/:id', 'CommentsController.editComment')
      Route.delete('/comments/:id', 'CommentsController.deleteComment')

      // LIKES
      Route.post('/likes', 'LikesController.likePost')
    }).prefix('/posts/:postId')
  }).middleware('auth')
}).prefix('/api')

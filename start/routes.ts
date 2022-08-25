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

// AUTH
Route.get('/ping', async () => {
  return { message: 'pong' }
})
Route.post('/login', 'AuthController.login')
Route.post('/register', 'AuthController.register')
Route.delete('/logout', 'AuthController.logout')

// POSTS
Route.get('/posts', 'PostsController.getAllPosts')
Route.post('/posts', 'PostsController.createPost')
Route.patch('/posts/:id', 'PostsController.editPost')
Route.delete('/posts/:id', 'PostsController.deletePost')

import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { UserFactory } from 'Database/factories'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await UserFactory.apply('admin')
      .with('posts', 2, (post) => post.with('comments', 3))
      .create()
    await UserFactory.with('posts', 2, (post) => post.with('comments', 2)).createMany(3)
  }
}

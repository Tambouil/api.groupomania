import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { UserFactory } from 'Database/factories'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await UserFactory.apply('admin').create()
    await UserFactory.with('posts', 2).createMany(3)
  }
}

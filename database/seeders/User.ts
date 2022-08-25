import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { Role } from 'App/Enums/Roles'
import User from 'App/Models/User'
import { UserFactory } from 'Database/factories'

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await User.create({
      username: 'admin',
      email: 'admin@admin.com',
      password: 'secret',
      role: Role.ADMIN,
    })

    await UserFactory.createMany(10)
  }
}

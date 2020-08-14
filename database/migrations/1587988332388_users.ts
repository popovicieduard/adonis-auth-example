import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('uuid').index()
      table.string('username', 255).notNullable()
      table.string('email_address', 254).notNullable().unique()
      table.string('password', 180).notNullable()
      table.boolean('is_active').defaultTo(true).notNullable()
      table.boolean('is_verified').defaultTo(false).notNullable()
      table.string('api_key').notNullable()
      table.string('secret_key').notNullable()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

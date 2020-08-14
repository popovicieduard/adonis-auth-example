import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import Encryption from '@ioc:Adonis/Core/Encryption'
import {
  column,
  beforeSave,
  beforeCreate,
  BaseModel,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'

import {v4 as uuid} from 'uuid'
import short from 'short-uuid'

import {UserTypeEnum} from 'App/Typings/User/Enums'

import Token from 'App/Models/Token'

export default class User extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column({ serializeAs: 'id' })
  public uuid: string

  @column()
  public username: string

  @column()
  public emailAddress: string

  @column({ serializeAs: null })
  public password: string

  @column({ serializeAs: null })
  public isActive: boolean

  @column()
  public isVerified: boolean

  @column({serializeAs: null})
  public type: UserTypeEnum

  @column({
    serializeAs: null,
    prepare: (value: string) => Encryption.encrypt(value),
    consume: (value: string) => Encryption.decrypt(value),
  })
  public apiKey: string

  @column({
    serializeAs: null,
    prepare: (value: string) => Encryption.encrypt(value),
    consume: (value: string) => Encryption.decrypt(value),
  })
  public secretKey: string

  @hasMany(() => Token)
  public tokens: HasMany<typeof Token>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @beforeCreate()
  public static async createUUID (user: User) {
    user.uuid = uuid()
  }

  @beforeCreate()
  public static async createAndEncryptApiKey (user: User) {
    user.apiKey = uuid()
  }

  @beforeCreate()
  public static async createAndEncryptSecretKey (user: User) {
    user.secretKey = short().new()
  }

  public checkPassword (password: string): any {
    return Hash.verify(this.password, password)
  }

  public checkApiKey (apiKey: string): boolean {
    return this.apiKey === apiKey ? true : false
  }
}

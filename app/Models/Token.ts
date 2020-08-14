import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

import User from 'App/Models/User'

export enum TokenTypeEnum {
  RESET = 'reset',
  CONFIRM = 'confirm'
}

export default class Token extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public token: string

  @column()
  public type: TokenTypeEnum

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public expired (): boolean {
    return this.createdAt.diffNow('minutes').minutes < -30 ? true : false
  }
}

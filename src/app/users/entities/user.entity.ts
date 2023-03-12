import { Core, CoreDocument } from '@app/core'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Field, ObjectType } from '@nestjs/graphql'
import { USER_ROLE_ENUM } from '../enums/roles.enum'

export type UserDocument = User & CoreDocument

@ObjectType()
@Schema({
  toJSON: {
    virtuals: true,
    getters: true
  },
  toObject: {
    virtuals: true,
    getters: true
  }
})
export class User extends Core {
  @Prop({ index: true, unique: true, required: true })
  @Field(() => String)
  email: string

  // avatar
  @Prop({ default: '' })
  @Field(() => String)
  avatar: string

  @Prop({
    type: Number,
    default: USER_ROLE_ENUM.USER,
    enum: [
      USER_ROLE_ENUM.USER,
      USER_ROLE_ENUM.ADMIN,
      USER_ROLE_ENUM.SUPER_ADMIN
    ],
    index: true
  })
  @Field(() => USER_ROLE_ENUM)
  role: USER_ROLE_ENUM

  @Prop({ required: true })
  password: string
}

export const UserEntity = SchemaFactory.createForClass(User)

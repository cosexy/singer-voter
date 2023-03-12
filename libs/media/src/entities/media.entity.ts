import { Core } from '@app/core'
import { Prop, Schema } from '@nestjs/mongoose'
import { Field, Float, ObjectType } from '@nestjs/graphql'
import { MEDIA_STORAGE_ENUM } from '@app/media/enums/media-storage.enum'
import { Document } from 'mongoose'

export type MediaDocument = Media & Document

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
export class Media extends Core {
  @Prop({
    type: String
  })
  @Field(() => String)
  path: string

  @Prop({
    type: Number,
    default: MEDIA_STORAGE_ENUM.LOCAL,
    enum: [MEDIA_STORAGE_ENUM.LOCAL],
    index: true
  })
  @Field(() => MEDIA_STORAGE_ENUM)
  storage: MEDIA_STORAGE_ENUM

  @Prop({
    type: Number,
    index: true
  })
  @Field(() => Float)
  size: number

  @Prop({
    type: String,
    index: true
  })
  @Field(() => String)
  mimetype: string
}

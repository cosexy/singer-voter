import { CoreDocument } from '@app/core'
import { Schema, SchemaFactory } from '@nestjs/mongoose'
import { Field, Float, ObjectType } from '@nestjs/graphql'
import { Media } from '@app/media'

export type ImageDocument = Image & CoreDocument

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
export class Image extends Media {
  @Field(() => Float)
  width: number

  @Field(() => Float)
  height: number
}

export const ImageEntity = SchemaFactory.createForClass(Image)

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Field, Float, ID, ObjectType } from '@nestjs/graphql'

export type CoreDocument = Core & Document

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
@ObjectType()
export class Core {
  @Field(() => ID)
  id: string

  @Prop({ required: true, type: Number, index: true })
  @Field(() => Float)
  createdAt: number

  @Prop({ required: true, type: Number, index: true })
  @Field(() => Float)
  updatedAt: number
}

export const CoreEntity = SchemaFactory.createForClass(Core)

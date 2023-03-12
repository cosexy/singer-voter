import { Core, CoreDocument } from '@app/core'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Field, Float, ObjectType } from '@nestjs/graphql'

export type ActorDocument = Actor & CoreDocument

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
export class Actor extends Core {
  @Field(() => String)
  @Prop({ required: true })
  name: string

  @Field(() => String)
  @Prop({ type: String })
  avatar: string

  @Field(() => Float)
  @Prop({ type: Number, default: 0, index: true })
  likes: string

  @Field()
  @Prop({ type: String, slug: ['name'], unique: true })
  slug: string
}

export const ActorEntity = SchemaFactory.createForClass(Actor)

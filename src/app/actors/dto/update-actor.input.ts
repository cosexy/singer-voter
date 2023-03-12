import { CreateActorInput } from './create-actor.input'
import { InputType, Field, PartialType, ID } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'
import { IsMongoId } from '~/shared/validator/objectid.validator'

@InputType()
export class UpdateActorInput extends PartialType(CreateActorInput) {
  @Field(() => ID)
  @IsNotEmpty()
  @IsMongoId()
  id: string
}

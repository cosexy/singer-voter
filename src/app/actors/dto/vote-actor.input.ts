import { InputType, Field, ID, Float } from '@nestjs/graphql'
import { IsNotEmpty, IsNumber, Min } from 'class-validator'
import { IsMongoId } from '~/shared/validator/objectid.validator'

@InputType()
export class VoteActorInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsMongoId()
  id: string

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  vote: number
}

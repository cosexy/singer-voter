import { InputType, Field, ID } from '@nestjs/graphql'
import { IsMongoId } from '~/shared/validator/objectid.validator'
import { IsNotEmpty } from 'class-validator'

@InputType()
export class RemoveAuthorInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsMongoId()
  id: string
}

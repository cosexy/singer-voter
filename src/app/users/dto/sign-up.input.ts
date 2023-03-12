import { InputType, Field } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'
import { Optional } from '@nestjs/common'

@InputType()
export class SignUpInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsEmail()
  email: string

  @Field(() => String)
  @MinLength(6)
  @Optional()
  password: string
}

import { Field, InputType } from '@nestjs/graphql'
import { PaginationFilter } from '~/shared/dto/pagination.filter'

@InputType()
export class GetActorsFilter extends PaginationFilter {
  @Field(() => String, { nullable: true })
  name?: string
}

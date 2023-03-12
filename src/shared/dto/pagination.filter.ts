import { InputType, Field, Int } from '@nestjs/graphql'
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { IsSortValid } from '~/shared/validator/sort.validator'
import { SortOrder } from 'mongoose'

@InputType()
export class PaginationFilter {
  @Field(() => String)
  @IsNotEmpty()
  @IsSortValid()
  sort: string

  @Field(() => Int)
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(20)
  limit: number

  @Field(() => Int)
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset: number

  #transformSort(sort: string): Record<string, SortOrder> {
    const sortRegex = /^.*:(asc|desc)?$/
    if (!sort || !sortRegex.test(sort)) {
      return {}
    }
    const [field, order] = sort.split(':')
    return { [field]: order === 'asc' ? 1 : -1 }
  }

  static get defaultSort(): Record<string, SortOrder> {
    return { createdAt: -1 }
  }

  get toMongoSort(): Record<string, SortOrder> {
    const baseSort = PaginationFilter.defaultSort
    const mongoSort = this.#transformSort(this.sort)
    return { ...baseSort, ...mongoSort }
  }
}

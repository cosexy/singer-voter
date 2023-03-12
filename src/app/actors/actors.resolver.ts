import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { ActorsService } from './actors.service'
import { Actor, ActorDocument } from './entities/actorEntity'
import { UpdateActorInput } from '~/app/actors/dto/update-actor.input'
import { InputValidator } from '~/shared/validator/input.validator'
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '~/guards/jwt.guard'
import { FilterQuery } from 'mongoose'
import { GetActorsFilter } from '~/app/actors/filter/get-actors.filter'
import { toMongoObjectIds } from '~/shared/validator/objectid.validator'
import { NotFoundError } from '~/shared/errors/not-found.error'
import { CurrentUser } from '~/decorators/user.decorator'
import { RemoveActorInput } from '~/app/actors/dto/remove-actor.input'

@Resolver(() => Actor)
export class ActorsResolver {
  constructor(private readonly authorsService: ActorsService) {}

  @Query(() => [Actor], { name: 'authors' })
  @UseGuards(JwtAuthGuard)
  async getAuthors(
    @Args('filter', new InputValidator()) filter: GetActorsFilter
  ) {
    // create filter by regex name
    const _filter: FilterQuery<ActorDocument> = {}
    if (filter.name) {
      _filter.name = {
        $regex: new RegExp(`^${filter.name}$`, 'i')
      }
    }
    return this.authorsService.find(_filter, filter)
  }

  @Mutation(() => Actor)
  @UseGuards(JwtAuthGuard)
  async updateAuthor(
    @Args('input', new InputValidator()) input: UpdateActorInput,
    @CurrentUser() user
  ) {
    // find _author by id
    const _author = await this.authorsService.get({
      _id: toMongoObjectIds(input.id)
    })
    if (!_author) {
      throw new NotFoundError('Author not found')
    }
    delete input.id
    return this.authorsService.update({ _id: _author._id }, input)
  }

  @Mutation(() => Actor)
  @UseGuards(JwtAuthGuard)
  async removeAuthor(
    @Args('input', new InputValidator()) input: RemoveActorInput
  ) {
    // find _author by id
    const _author = await this.authorsService.get({
      _id: toMongoObjectIds(input.id)
    })
    if (!_author) {
      throw new NotFoundError('Author not found')
    }
    return this.authorsService.remove({ _id: _author._id })
  }
}

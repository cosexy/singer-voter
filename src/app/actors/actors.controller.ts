import { Body, Controller, Delete, Post, Put, UseGuards } from '@nestjs/common'
import { CreateActorInput } from '~/app/actors/dto/create-actor.input'
import { InputValidator } from '~/shared/validator/input.validator'
import { ActorsService } from '~/app/actors/actors.service'
import { JwtAuthGuard } from '~/guards/jwt.guard'
import { UpdateActorInput } from '~/app/actors/dto/update-actor.input'
import { toMongoObjectIds } from '~/shared/validator/objectid.validator'
import { NotFoundError } from '~/shared/errors/not-found.error'
import { RemoveActorInput } from '~/app/actors/dto/remove-actor.input'
import { VoteActorInput } from '~/app/actors/dto/vote-actor.input'
import * as dayjs from 'dayjs'

@Controller('actors')
export class ActorsController {
  constructor(private readonly authorsService: ActorsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body(new InputValidator()) input: CreateActorInput) {
    return this.authorsService.create(input)
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async update(@Body(new InputValidator()) input: UpdateActorInput) {
    const _author = await this.authorsService.get({
      _id: toMongoObjectIds(input.id)
    })
    if (!_author) {
      throw new NotFoundError('Author not found')
    }
    delete input.id
    const _new = await this.authorsService.update({ _id: _author._id }, input)

    return {
      ..._new.toJSON(),
      createdAt: dayjs(_new.createdAt).format('DD/MM/YYYY HH:mm'),
      updatedAt: dayjs(_new.updatedAt).format('DD/MM/YYYY HH:mm')
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async remove(@Body(new InputValidator()) input: RemoveActorInput) {
    // find _author by id
    const _author = await this.authorsService.get({
      _id: toMongoObjectIds(input.id)
    })
    if (!_author) {
      throw new NotFoundError('Author not found')
    }
    return this.authorsService.remove({ _id: _author._id })
  }

  @UseGuards(JwtAuthGuard)
  @Post('vote')
  async vote(@Body(new InputValidator()) input: VoteActorInput) {
    console.log(input)
    // find _author by id
    const _author = await this.authorsService.get({
      _id: toMongoObjectIds(input.id)
    })
    if (!_author) {
      throw new NotFoundError('Author not found')
    }
    return this.authorsService.update(
      { _id: _author._id },
      {
        $inc: { likes: input.vote }
      }
    )
  }
}

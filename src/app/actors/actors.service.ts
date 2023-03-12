import { Injectable } from '@nestjs/common'
import { CoreService } from '@app/core'
import { Actor, ActorDocument } from './entities/actorEntity'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'

@Injectable()
export class ActorsService extends CoreService<ActorDocument> {
  constructor(
    @InjectModel(Actor.name) private authorModel: Model<ActorDocument>
  ) {
    super(authorModel)
  }
}

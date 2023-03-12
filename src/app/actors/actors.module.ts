import { Module } from '@nestjs/common'
import { ActorsService } from './actors.service'
import { ActorsResolver } from './actors.resolver'
import { MongooseModule } from '@nestjs/mongoose'
import { Actor, ActorEntity } from './entities/actorEntity'
import { ActorsController } from './actors.controller'

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Actor.name,
        useFactory: () => {
          const schema = ActorEntity
          schema.plugin(require('mongoose-slug-generator'))
          return schema
        }
      }
    ])
  ],
  providers: [ActorsResolver, ActorsService],
  controllers: [ActorsController],
  exports: [ActorsService]
})
export class ActorsModule {}

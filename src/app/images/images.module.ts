import { Global, Module } from '@nestjs/common'
import { ImagesService } from './images.service'
import { ImagesResolver } from './images.resolver'
import { ImagesController } from './images.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Image, ImageEntity } from '~/app/images/entities/image.entity'

@Global()
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Image.name,
        useFactory: () => {
          const schema = ImageEntity
          schema.plugin(require('mongoose-slug-generator'))
          return schema
        }
      }
    ])
  ],
  providers: [ImagesResolver, ImagesService],
  controllers: [ImagesController],
  exports: [ImagesService]
})
export class ImagesModule {}

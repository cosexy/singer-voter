import { Resolver } from '@nestjs/graphql'
import { ImagesService } from './images.service'
import { Image } from './entities/image.entity'

@Resolver(() => Image)
export class ImagesResolver {
  constructor(private readonly imagesService: ImagesService) {}
}

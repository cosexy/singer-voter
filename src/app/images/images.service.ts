import { Injectable } from '@nestjs/common'
import { MediaService } from '@app/media'
import { Image, ImageDocument } from '~/app/images/entities/image.entity'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class ImagesService extends MediaService<ImageDocument> {
  constructor(@InjectModel(Image.name) readonly model: Model<ImageDocument>) {
    super(model)
  }
  name = 'images'
}

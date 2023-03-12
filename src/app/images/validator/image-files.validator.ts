import { Inject, Injectable } from '@nestjs/common'
import { MediaFilesValidator, MediaInstance } from '@app/media'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'
import * as sharp from 'sharp'
import { Metadata, Sharp } from 'sharp'

@Injectable()
export class ImageFilesValidationPipe extends MediaFilesValidator {
  constructor(@Inject(REQUEST) protected readonly request: Request) {
    super()
  }
  acceptedExtensions: string[] = ['jpg', 'jpeg', 'png']

  async getMetaData(
    pipeline: Sharp
  ): Promise<Pick<Metadata, 'width' | 'height' | 'size'>> {
    const metadata = await pipeline.metadata()
    return {
      width: metadata.width,
      height: metadata.height,
      size: metadata.size
    }
  }

  async nextSize(group: string, meta: Pick<Metadata, 'width' | 'height'>) {
    const size: Pick<Metadata, 'width' | 'height'> = {
      width: 0,
      height: 0
    }
    switch (group) {
      default:
        size.width = 800
    }

    // scale size
    size.height = Math.round((size.width * meta.height) / meta.width)
    return size
  }

  getGroup() {
    return this.request.body['group'] || 'default'
  }

  async resizeImage(file: MediaInstance) {
    const pipeline = sharp(file.buffer)
    const metadata = await this.getMetaData(pipeline)
    const size = await this.nextSize(this.getGroup(), metadata)

    const buffer = await pipeline.resize(size).toBuffer()
    const newMetadata = await sharp(buffer).metadata()

    return {
      ...file,
      ...newMetadata,
      buffer
    }
  }

  async filesTransform(files: MediaInstance[]) {
    return Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            this.resizeImage(file)
              .then((image) => resolve(image))
              .catch((error) => reject(error))
          })
      )
    )
  }
}

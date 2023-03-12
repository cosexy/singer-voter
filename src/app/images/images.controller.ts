import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { ImageFilesValidationPipe } from './validator/image-files.validator'
import { JwtAuthGuard } from '~/guards/jwt.guard'
import { CurrentUser } from '~/decorators/user.decorator'
import { MediaInstance } from '@app/media'
import { ImagesService } from '~/app/images/images.service'
import { User } from '~/app/users/entities/user.entity'
import { AnyKeys } from 'mongoose'
import { ImageDocument } from '~/app/images/entities/image.entity'

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images'))
  async upload(
    @UploadedFiles(ImageFilesValidationPipe) files: MediaInstance[],
    @CurrentUser() user: User,
    @Body('group') group = 'default'
  ) {
    const images = await Promise.all<AnyKeys<ImageDocument>>(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const { abs, rel } = this.imagesService.buildFilePath(
              file.originalname,
              group,
              user.id
            )
            this.imagesService.writeFile(file.buffer, abs).then(() => {
              resolve({
                size: file.size,
                mimetype: file.mimetype,
                width: file.width,
                height: file.height,
                path: rel
              })
            })
          })
      )
    )
    const _imgs = await this.imagesService.create(images)

    return _imgs.map((img) => img.path)
  }
}

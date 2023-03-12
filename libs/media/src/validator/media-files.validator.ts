import {
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform
} from '@nestjs/common'
import * as mime from 'mime'

export interface MediaInstance extends Partial<Express.Multer.File> {
  [key: string]: any
}

@Injectable()
export class MediaFilesValidator implements PipeTransform {
  acceptedExtensions = []

  checkFileExtension(file: MediaInstance) {
    const fileExtension = this.getFileExtension(file)
    return this.acceptedExtensions.includes(fileExtension)
  }

  getFileExtension(file: MediaInstance) {
    return mime.getExtension(file.mimetype)
  }

  toArray(value: any) {
    return Array.isArray(value) ? value : [value]
  }

  throwException() {
    throw new HttpException(this.defaultError, HttpStatus.BAD_REQUEST)
  }

  get defaultError() {
    return 'Invalid files'
  }

  async filesTransform(files: MediaInstance[]) {
    return files
  }

  async transform(value: MediaInstance | MediaInstance[]) {
    if (!value) {
      throw new HttpException('Invalid Input', HttpStatus.BAD_REQUEST)
    }
    const files = this.toArray(value)
    for (const file of files) {
      if (!this.checkFileExtension(file)) {
        this.throwException()
      }
    }
    return this.filesTransform(files)
  }
}

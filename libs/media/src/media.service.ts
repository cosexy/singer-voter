import { Injectable } from '@nestjs/common'
import * as path from 'path'
import * as fs from 'fs'
import { MediaDocument } from '@app/media/entities/media.entity'
import { CoreService } from '@app/core'

@Injectable()
export class MediaService<T extends MediaDocument> extends CoreService<T> {
  root = 'public'
  parent = 'uploads'
  name = 'media'

  buildFileName(filename: string, counter: number, ext: string) {
    return `${filename}${counter ? counter : '_' + counter}${ext}`
  }

  buildFilePath(originalname: string, folder: string, userId: string) {
    const ext = path.extname(originalname)
    const filename = originalname.slice(0, originalname.length - ext.length)
    let counter = 1

    const getAbsPath = () =>
      path.join(
        __dirname,
        '..',
        this.root,
        this.parent,
        userId,
        folder,
        this.buildFileName(filename, counter, ext)
      )

    let absPath = getAbsPath()

    while (fs.existsSync(absPath)) {
      counter++
      absPath = getAbsPath()
    }

    return {
      abs: absPath,
      rel: path.relative(path.join(__dirname, '..', this.root), absPath)
    }
  }

  async writeFile(buffer: Buffer, _path: string) {
    const dir = _path.substring(0, _path.lastIndexOf('/'))
    // Create the directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    // create folder if not exists
    return fs.writeFileSync(_path, buffer)
  }
}

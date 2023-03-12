import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cookieParser from 'cookie-parser'
import { ConfigService } from '@nestjs/config'
import { exec } from 'child_process'
import { join } from 'path'
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    snapshot: true
  })
  app.useStaticAssets(join(__dirname, '..', 'public'))
  app.setBaseViewsDir(join(__dirname, '..', 'views'))
  app.setViewEngine('ejs')

  app.enableCors()
  app.use(cookieParser())

  const configService = app.get(ConfigService)
  await app.listen(configService.get<string>('PORT'))

  // log the endpoint
  console.log(`🔥http://localhost:${configService.get<string>('PORT')}`)

  await commitApollo()
}
bootstrap()

const commitApollo = async () => {
  console.log('Comitting Apollo schema...')
  try {
    exec('npm run apollo:build && npm run apollo:commit')
    console.log('Committed Apollo schema')
  } catch (e) {
    console.log('Error committing Apollo schema', e)
  }
}

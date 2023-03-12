import { Global, Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserEntity } from './entities/user.entity'
import { UsersResolver } from './users.resolver'
import { AuthModule } from '../auth/auth.module'

@Global()
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserEntity
          // schema.plugin(require('mongoose-slug-generator'))
          return schema
        }
      }
    ]),
    AuthModule
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersResolver],
  exports: [UsersService]
})
export class UsersModule {}

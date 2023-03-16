import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AdminService } from './admin.service'
import { AdminController } from './admin.controller'
import { AdminMiddleware } from '~/middleware/admin.middleware'
import { ActorsModule } from '~/app/actors/actors.module'
import { UsersModule } from '~/app/users/users.module'

@Module({
  imports: [ActorsModule, UsersModule],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AdminMiddleware).forRoutes('admin')
  }
}

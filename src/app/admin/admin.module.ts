import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AdminService } from './admin.service'
import { AdminController } from './admin.controller'
import { AdminMiddleware } from '~/middleware/admin.middleware'
import { ActorsModule } from '~/app/actors/actors.module'

@Module({
  imports: [ActorsModule],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AdminMiddleware).forRoutes('admin')
  }
}

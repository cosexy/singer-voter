import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './database/database.module'
import { UsersModule } from './app/users/users.module'
import { AuthModule } from './app/auth/auth.module'
import { ApolloModule } from './apollo/apollo.module'
import { ActorsModule } from './app/actors/actors.module'
import { AppResolver } from '~/app.resolver'
import { ImagesModule } from '~/app/images/images.module'
import { AdminModule } from './app/admin/admin.module'
import { DevtoolsModule } from '@nestjs/devtools-integration'

@Module({
  imports: [
    ConfigModule.forRoot(),
    ApolloModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    ActorsModule,
    ImagesModule,
    AdminModule,
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production'
    })
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver]
})
export class AppModule {}

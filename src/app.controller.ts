import { Controller, Get, Res, UseGuards } from '@nestjs/common'
import { AppService } from './app.service'
import { JwtAuthGuard } from '~/guards/jwt.guard'
import { CurrentUser } from '~/decorators/user.decorator'
import { Response } from 'express'
import { Public } from '~/decorators/public.decorator'
import { ActorsService } from '~/app/actors/actors.service'
import { User } from '~/app/users/entities/user.entity'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly actorsService: ActorsService
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @Public()
  async root(@CurrentUser() user: User, @Res() res: Response) {
    if (!user) {
      return res.render('index')
    }
    const actors = await this.actorsService.find()
    return res.render('home/index', {
      actors,
      user
    })
  }
}

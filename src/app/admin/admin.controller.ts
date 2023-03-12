import { Controller, Get, UseGuards, Render, UseFilters } from '@nestjs/common'
import { AdminService } from './admin.service'
import { AdminGuard } from '~/guards/admin.guard'
import { AdminFilter } from '~/filters/admin.filter'
import { ActorsService } from '~/app/actors/actors.service'
import * as dayjs from 'dayjs'

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly actorsService: ActorsService
  ) {}

  @Get()
  @UseGuards(AdminGuard)
  @UseFilters(AdminFilter)
  @Render('admin/index')
  async root() {
    const actors = await this.actorsService.find()
    return {
      actors: actors.map((actor) => ({
        ...actor.toJSON(),
        createdAt: dayjs(actor.createdAt).format('DD/MM/YYYY HH:mm'),
        updatedAt: dayjs(actor.updatedAt).format('DD/MM/YYYY HH:mm')
      }))
    }
  }
}

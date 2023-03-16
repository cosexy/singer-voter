import { Body, Controller, Delete, Param, Put } from '@nestjs/common'
import { UsersService } from './users.service'
import { Types } from 'mongoose'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new Error('Invalid id')
    }

    if (!body || !body.likes) {
      throw new Error('Invalid body')
    }

    const user = await this.usersService.get({
      _id: new Types.ObjectId(id)
    })
    if (!user) {
      throw new Error('User not found')
    }
    return this.usersService.update(
      {
        _id: new Types.ObjectId(id)
      },
      {
        balance: Number(body.likes)
      }
    )
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new Error('Invalid id')
    }

    const user = await this.usersService.get({
      _id: new Types.ObjectId(id)
    })
    if (!user) {
      throw new Error('User not found')
    }
    return this.usersService.remove({
      _id: new Types.ObjectId(id)
    })
  }
}

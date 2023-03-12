import { Injectable } from '@nestjs/common'
import { CoreService } from '@app/core'
import { User, UserDocument } from './entities/user.entity'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class UsersService extends CoreService<UserDocument> {
  constructor(@InjectModel(User.name) readonly userModel: Model<UserDocument>) {
    super(userModel)
  }
}

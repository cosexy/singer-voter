import { Injectable, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

import { Types } from 'mongoose'
import { UsersService } from '../users/users.service'
import { User } from '../users/entities/user.entity'

@Injectable()
export class AuthService {
  private logger: Logger = new Logger(AuthService.name)

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(input: any) {
    const user = await this.usersService.get({ _id: input._id })
    return this.JWTGenerator(user)
  }

  async JWTVerify(id: Types.ObjectId): Promise<any> {
    return this.usersService.get({ _id: new Types.ObjectId(id) })
  }

  async JWTGenerator({ id }: User) {
    return this.jwtService.signAsync({ id }, { expiresIn: '365d' })
  }

  async isMatchPassword(password: string, hash: string) {
    return bcrypt.compare(password, hash)
  }

  async hashPassword(password: string, rounds?: number) {
    return bcrypt.hash(password, rounds || 10)
  }

  async checkToken(token: string) {
    if (token) {
      try {
        const payload = await this.jwtService.verifyAsync(
          token.replace('Bearer ', '').trim()
        )
        return this.JWTVerify(new Types.ObjectId(payload.id))
      } catch (e) {
        console.log(e)
      }
    }
  }
}

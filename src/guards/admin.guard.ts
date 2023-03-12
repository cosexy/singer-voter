import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { JwtAuthGuard } from '~/guards/jwt.guard'
import { User } from '~/app/users/entities/user.entity'
import { USER_ROLE_ENUM } from '~/app/users/enums/roles.enum'

@Injectable()
export class AdminGuard extends JwtAuthGuard {
  handleRequest(
    err: any,
    user: User | null,
    info: any,
    context: any,
    status?: any
  ) {
    if (
      !user ||
      ![USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPER_ADMIN].includes(user.role)
    ) {
      throw new HttpException('Forbidden', HttpStatus.UNAUTHORIZED)
    }
    return super.handleRequest(err, user, info, context, status)
  }
}

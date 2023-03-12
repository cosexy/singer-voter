import { ExecutionContext, Injectable, Logger } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from '~/decorators/public.decorator'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name)
  constructor(private reflector: Reflector) {
    super()
  }

  getRequest(context: ExecutionContext) {
    const { req, connection } = GqlExecutionContext.create(context).getContext()
    if (connection && !req) {
      return connection
    }
    if (req.cookies && req.cookies._token) {
      req.headers.authorization = 'Bearer ' + req.cookies._token
    }
    return req
  }

  handleRequest(err: any, user: any, info: any, context: any, status?: any) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (isPublic && !user) {
      return null
    }
    return super.handleRequest(err, user, info, context, status)
  }
}

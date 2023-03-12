import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { UserDocument } from '~/app/users/entities/user.entity'
export const CurrentUser = createParamDecorator(
  async (data: unknown, context: ExecutionContext): Promise<UserDocument> => {
    const { req, connection } = GqlExecutionContext.create(context).getContext()
    return connection?.user || req?.user
  }
)

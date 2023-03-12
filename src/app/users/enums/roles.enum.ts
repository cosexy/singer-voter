// nestjs graphql enum USER_ROLE
import { registerEnumType } from '@nestjs/graphql'

export enum USER_ROLE_ENUM {
  USER,
  ADMIN,
  SUPER_ADMIN
}

registerEnumType(USER_ROLE_ENUM, {
  name: 'USER_ROLE_ENUM'
})

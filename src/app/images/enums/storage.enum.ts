// nestjs graphql enum USER_ROLE
import { registerEnumType } from '@nestjs/graphql'

export enum IMAGE_STORAGE_ENUM {
  LOCAL
}

registerEnumType(IMAGE_STORAGE_ENUM, {
  name: 'IMAGE_STORAGE_ENUM'
})

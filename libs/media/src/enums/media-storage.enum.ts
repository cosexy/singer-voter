// nestjs graphql enum USER_ROLE
import { registerEnumType } from '@nestjs/graphql'

export enum MEDIA_STORAGE_ENUM {
  LOCAL
}

registerEnumType(MEDIA_STORAGE_ENUM, {
  name: 'MEDIA_STORAGE_ENUM'
})

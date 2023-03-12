import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments
} from 'class-validator'
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import { ObjectId } from 'mongodb'

@Injectable()
export class ObjectIdPipe implements PipeTransform {
  transform(value: any, metadata?: any) {
    const isValidObjectId = ObjectId.isValid(value)
    if (!isValidObjectId) {
      throw new BadRequestException('Invalid ObjectId')
    }
    return new ObjectId(value)
  }
}

export function IsMongoId(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isMongoId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value) {
          if (Array.isArray(value)) {
            return value.every((id: string) => ObjectId.isValid(id))
          }
          return ObjectId.isValid(value)
        },
        defaultMessage(args: ValidationArguments) {
          return `Invalid MongoDB ObjectID in ${args.property}`
        }
      }
    })
  }
}

export function toMongoObjectIds(value): ObjectId | ObjectId[] {
  const transformMongoId = new ObjectIdPipe()
  if (typeof value === 'string') {
    return transformMongoId.transform(value)
  } else if (Array.isArray(value)) {
    return value.map((id) => transformMongoId.transform(id))
  } else {
    return value
  }
}

import { registerDecorator, ValidationOptions } from 'class-validator'

export function IsSortValid(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isSortValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          const regex = /^(\w+)(:(asc|desc))?$/
          return regex.test(value)
        },
        defaultMessage: () => {
          return 'Sort is invalid. It should be of the form <field>, <field>:asc or <field>:desc'
        }
      }
    })
  }
}

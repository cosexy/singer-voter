import { ValidationError, ValidationPipe } from '@nestjs/common'
import { UserInputError } from 'apollo-server-express'
import { ValidationPipeOptions } from '@nestjs/common/pipes/validation.pipe'

export class InputValidator extends ValidationPipe {
  constructor(options: ValidationPipeOptions = {}) {
    super({
      ...options,
      exceptionFactory(errors: ValidationError[]) {
        const formattedErrors = errors.map((error) => {
          const constraints = error.constraints
          const key = Object.keys(constraints)[0]
          return { field: error.property, message: constraints[key] }
        })
        return new UserInputError('Validation failed', {
          errors: formattedErrors
        })
      }
    })
  }
}

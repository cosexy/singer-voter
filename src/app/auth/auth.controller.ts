import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from '~/app/auth/auth.service'
import { SignInInput } from '~/app/users/dto/sign-in.input'
import { SignUpInput } from '~/app/users/dto/sign-up.input'
import { InputValidator } from '~/shared/validator/input.validator'
import { UsersService } from '~/app/users/users.service'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Post('login')
  async login(@Body(new InputValidator()) input: SignInInput) {
    const user = await this.usersService.get({ email: input.email })
    if (!user) {
      throw new Error('User not found')
    }
    const isMatch = await this.authService.isMatchPassword(
      input.password,
      user.password
    )
    if (!isMatch) {
      throw new Error('Invalid password')
    }
    return {
      token: await this.authService.JWTGenerator(user)
    }
  }

  @Post('register')
  async register(@Body(new InputValidator()) input: SignUpInput) {
    const _user = await this.usersService.get({ email: input.email })
    if (_user) {
      throw new Error('User already exists')
    }
    const password = await this.authService.hashPassword(input.password)
    const user = await this.usersService.create({
      email: input.email,
      password
    })
    return {
      token: await this.authService.JWTGenerator(user)
    }
  }
}

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { User } from './entities/user.entity'
import { UsersService } from './users.service'
import { AuthService } from '../auth/auth.service'
import { InputValidator } from '~/shared/validator/input.validator'
import { UseGuards } from '@nestjs/common'
import { CurrentUser } from '~/decorators/user.decorator'
import { JwtAuthGuard } from '~/guards/jwt.guard'
import { SignUpInput } from './dto/sign-up.input'
import { SignInInput } from './dto/sign-in.input'

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}

  @Mutation(() => String)
  async signUp(@Args('input', new InputValidator()) input: SignUpInput) {
    const _user = await this.usersService.get({ email: input.email })
    if (_user) {
      throw new Error('User already exists')
    }
    const password = await this.authService.hashPassword(input.password)
    const user = await this.usersService.create({
      email: input.email,
      password
    })
    return this.authService.JWTGenerator(user)
  }

  @Mutation(() => String)
  async signIn(@Args('input', new InputValidator()) input: SignInInput) {
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
    return this.authService.JWTGenerator(user)
  }

  @Query(() => User, { name: 'me' })
  @UseGuards(JwtAuthGuard)
  getUser(@CurrentUser() user) {
    return user
  }
}

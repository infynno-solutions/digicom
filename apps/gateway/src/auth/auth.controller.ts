import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from '@repo/shared';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('verify/:token')
  verify(@Param('token') token: string) {
    return this.authService.verify(token);
  }
}

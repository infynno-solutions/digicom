import { Body, Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from '@repo/shared';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Body() createUserDto: CreateUserDto): string {
    return this.appService.getHello();
  }
}

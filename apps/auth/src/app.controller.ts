import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from '@repo/shared';

@Controller()
export class AppController {
  constructor() {}

  @MessagePattern('create_user')
  createUser(@Payload() message: CreateUserDto) {
    return message;
  }
}

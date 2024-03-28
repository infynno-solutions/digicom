import { BadRequestException, Controller, Inject } from '@nestjs/common';
import {
  ClientKafka,
  MessagePattern,
  Payload,
  RpcException,
} from '@nestjs/microservices';
import { CreateUserDto } from '@repo/shared';
import { db } from '@repo/db';
import slugify from 'slugify';
import { nanoid } from 'nanoid';

@Controller()
export class AppController {
  constructor(
    @Inject('MAIL_MICROSERVICE') private readonly mailClient: ClientKafka,
  ) {}

  @MessagePattern('create-user')
  async createUser(@Payload() message: CreateUserDto) {
    const exists = await db.user.findUnique({
      where: { email: message.email },
    });

    if (exists) {
      throw new RpcException(
        new BadRequestException('User already registered'),
      );
    }

    const username = slugify(`${message.name}-${nanoid(5)}`, {
      trim: true,
      strict: true,
      lower: true,
    });

    const user = await db.user.create({
      data: {
        name: message.name,
        username,
        email: message.email,
        password: message.password,
      },
    });

    const token = nanoid(32);

    await db.token.create({
      data: {
        token,
        type: 'EMAIL_VERIFICATION',
        userId: user.id,
      },
    });

    this.mailClient.emit(
      'send-email-verification-mail',
      JSON.stringify({
        to: user.email,
        name: user.name,
        token,
      }),
    );

    return {
      message: 'Success',
    };
  }
}

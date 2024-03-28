import { BadRequestException, Controller, Inject } from '@nestjs/common';
import {
  ClientKafka,
  MessagePattern,
  Payload,
  RpcException,
} from '@nestjs/microservices';
import { CreateUserDto, LoginUserDto } from '@repo/shared';
import { db } from '@repo/db';
import slugify from 'slugify';
import { nanoid } from 'nanoid';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    @Inject('MAIL_MICROSERVICE') private readonly mailClient: ClientKafka,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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

    const password = await bcrypt.hash(message.password, 12);

    const user = await db.user.create({
      data: {
        name: message.name,
        email: message.email,
        username,
        password,
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

  @MessagePattern('login-user')
  async loginUser(@Payload() message: LoginUserDto) {
    const user = await db.user.findUnique({
      where: {
        email: message.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerifiedAt: true,
        password: true,
        username: true,
      },
    });
    if (!user) {
      throw new RpcException(new BadRequestException('User not found.'));
    }

    const isPasswordMatching = await bcrypt.compare(
      message.password,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new RpcException(new BadRequestException('Invalid password.'));
    }

    if (!user.emailVerifiedAt) {
      throw new RpcException(
        new BadRequestException('Email verification pending.'),
      );
    }

    const userData = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
    };

    const token = await this.jwtService.signAsync(userData, {
      secret: this.configService.get('JWT_SECRET'),
    });

    return {
      message: 'Success',
      user: userData,
      token,
    };
  }

  @MessagePattern('verify-email')
  async verifyEmail(@Payload() message: { token: string }) {
    const token = await db.token.findUnique({
      where: { token: message.token },
    });

    if (
      !token ||
      (token.expiresAt !== null && token.expiresAt < new Date(Date.now()))
    ) {
      throw new RpcException(
        new BadRequestException('Invalid or expired token.'),
      );
    }

    await db.user.update({
      where: { id: token.userId },
      data: {
        emailVerifiedAt: new Date(Date.now()),
      },
    });

    await db.token.delete({ where: { token: message.token } });

    return {
      message: 'Success',
    };
  }
}

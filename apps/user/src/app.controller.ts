import { Controller, InternalServerErrorException } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { db } from '@repo/db';
import { ConnectStripeDto } from '@repo/shared';

@Controller()
export class AppController {
  constructor() {}

  @MessagePattern('connect-stripe')
  async connectStripe(
    @Payload() message: ConnectStripeDto & { userId: string },
  ) {
    await db.paymentAccount.upsert({
      where: {
        userId_provider: {
          userId: message.userId,
          provider: 'STRIPE',
        },
      },
      create: {
        provider: 'STRIPE',
        ...message,
      },
      update: message,
    });

    return {
      message: 'Success',
    };
  }

  @MessagePattern('get-stripe')
  async getStripe(@Payload() message: { userId: string }) {
    const account = await db.paymentAccount.findUnique({
      where: {
        userId_provider: {
          provider: 'STRIPE',
          userId: message.userId,
        },
      },
    });

    return {
      message: 'Success',
      account,
    };
  }
}

import { BadRequestException, Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { db } from '@repo/db';
import { ConnectStripeDto } from '@repo/shared';
import Stripe from 'stripe';

@Controller()
export class AppController {
  constructor() {}

  @MessagePattern('connect-stripe')
  async connectStripe(
    @Payload() message: ConnectStripeDto & { userId: string },
  ) {
    try {
      const stripe = new Stripe(message.stripeSecretKey);
      await stripe.accounts.list();
    } catch (e) {
      throw new RpcException(
        new BadRequestException('Error validating your keys.'),
      );
    }

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

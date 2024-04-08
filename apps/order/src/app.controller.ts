import { Controller, NotFoundException } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { CreateOrderDto } from '../../../packages/shared/dist';
import { db } from '@repo/db';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) {}

  @MessagePattern('create-order')
  async create(createOrderDto: CreateOrderDto): Promise<any> {
    const product = await db.product.findUnique({
      where: { id: createOrderDto.productId },
    });
    if (!product) {
      throw new RpcException(new NotFoundException('Product not found'));
    }

    const stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'));

    const order = await db.order.create({
      data: {
        userEmail: createOrderDto.email,
        productId: createOrderDto.productId,
        price: product.price,
        currency: product.currency,
      },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: product.currency.toLowerCase(),
            product_data: {
              name: product.title,
            },
            unit_amount: product.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:3000/order/${order.id}/success`,
      cancel_url: `http://localhost:3000/order/${order.id}/cancel`,
      client_reference_id: order.id,
      customer_email: createOrderDto.email,
      metadata: {
        orderId: order.id,
      },
    });

    await db.order.update({
      where: { id: order.id },
      data: { paymentRequestId: session.id },
    });

    return {
      message: 'Success',
      url: session.url,
    };
  }
}

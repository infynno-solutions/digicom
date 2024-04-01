import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { db } from '@repo/db';
import { CreateProductDto } from '@repo/shared';

@Controller()
export class AppController {
  @MessagePattern('create-product')
  async createProduct(
    @Payload() message: CreateProductDto & { userId: string },
  ): Promise<any> {
    console.log('🚀 ~ AppController ~ message:', message);
    const product = await db.product.create({ data: message });

    return {
      message: 'Success',
      product,
    };
  }
}

import { Controller, NotFoundException } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { db } from '@repo/db';
import { CreateProductDto } from '@repo/shared';

interface ListProductsMessage {
  userId: string;
  page?: number;
}

interface GetProductMessage {
  userId: string;
  id: string;
}

@Controller()
export class AppController {
  @MessagePattern('create-product')
  async createProduct(
    @Payload() message: CreateProductDto & { userId: string },
  ): Promise<any> {
    const product = await db.product.create({ data: message });

    return {
      message: 'Success',
      product,
    };
  }

  @MessagePattern('list-products')
  async listProducts(@Payload() message: ListProductsMessage): Promise<any> {
    const page = message.page || 1;
    const skip = 20 * (Number(page) - 1);
    const products = await db.product.findMany({
      take: 20,
      skip,
      where: {
        userId: message.userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return {
      message: 'Success',
      products,
    };
  }

  @MessagePattern('get-product')
  async getProduct(@Payload() message: GetProductMessage): Promise<any> {
    const product = await db.product.findUnique({
      where: {
        userId: message.userId,
        id: message.id,
      },
    });

    if (!product) {
      throw new RpcException(new NotFoundException('Product not found.'));
    }

    return {
      message: 'Success',
      product,
    };
  }
}

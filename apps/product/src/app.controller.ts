import { Controller, NotFoundException } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { db } from '@repo/db';
import { CreateProductDto, UpdateProductDto } from '@repo/shared';

interface ListProductsMessage {
  userId: string;
  page?: number;
  order?: string;
  orderBy?: string;
  search?: string;
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
  ): Promise<{ message: string; product: any }> {
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
        title: message.search
          ? {
              contains: message.search,
              mode: 'insensitive',
            }
          : undefined,
      },
      orderBy:
        message.orderBy && message.order
          ? {
              [message.orderBy]: message.order,
            }
          : {
              createdAt: 'desc',
            },
    });
    const total = await db.product.count({
      where: {
        userId: message.userId,
        title: message.search ? { contains: message.search } : undefined,
      },
    });

    return {
      message: 'Success',
      products,
      total,
      totalPages: Math.ceil(total / 20),
    };
  }

  @MessagePattern('get-product')
  async getProduct(@Payload() message: GetProductMessage): Promise<any> {
    const product = await db.product.findUnique({
      where: {
        userId: message.userId,
        id: message.id,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
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

  @MessagePattern('update-product')
  async updateProduct(
    @Payload() message: UpdateProductDto & { userId: string; id: string },
  ): Promise<{ message: string; product: any }> {
    let product = await db.product.findUnique({ where: { id: message.id } });

    if (!product) {
      throw new RpcException(new NotFoundException('Product not found.'));
    }

    product = await db.product.update({
      where: { id: message.id },
      data: message,
    });

    return {
      message: 'Success',
      product,
    };
  }

  @MessagePattern('delete-product')
  async deleteProduct(
    @Payload() message: { id: string },
  ): Promise<{ message: string }> {
    const product = await db.product.findUnique({ where: { id: message.id } });

    if (!product) {
      throw new RpcException(new NotFoundException('Product not found.'));
    }

    await db.$transaction(async (prisma) => {
      await prisma.productDelivery.deleteMany({
        where: { productId: message.id },
      });
      await prisma.product.delete({
        where: { id: message.id },
      });
    });

    return {
      message: 'Success',
    };
  }
}

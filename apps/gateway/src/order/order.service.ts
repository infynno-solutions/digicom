import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { CreateOrderDto } from '@repo/shared';
import { catchError, throwError } from 'rxjs';

@Injectable()
export class OrderService {
  constructor(
    @Inject('ORDER_MICROSERVICE') private readonly orderClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.orderClient.subscribeToResponseOf('create-order');
    await this.orderClient.connect();
  }

  async onModuleDestroy() {
    await this.orderClient.close();
  }

  createOrder(createOrderDto: CreateOrderDto) {
    return this.orderClient
      .send('create-order', JSON.stringify(createOrderDto))
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }
}

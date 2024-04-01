import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { CreateProductDto } from '@repo/shared';
import { catchError, throwError } from 'rxjs';
import { IAuthUser } from 'src/auth/auth.interface';

@Injectable()
export class ProductService {
  constructor(
    @Inject('PRODUCT_MICROSERVICE') private readonly productClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.productClient.subscribeToResponseOf('create-product');
    await this.productClient.connect();
  }

  async onModuleDestroy() {
    await this.productClient.close();
  }

  create(createProductDto: CreateProductDto, user: IAuthUser) {
    return this.productClient
      .send(
        'create-product',
        JSON.stringify({
          ...createProductDto,
          userId: user.id,
        }),
      )
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }
}

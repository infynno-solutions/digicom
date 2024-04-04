import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { CreateProductDto, UpdateProductDto } from '@repo/shared';
import { catchError, throwError } from 'rxjs';
import { IAuthUser } from 'src/auth/auth.interface';

@Injectable()
export class ProductService {
  constructor(
    @Inject('PRODUCT_MICROSERVICE') private readonly productClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.productClient.subscribeToResponseOf('create-product');
    this.productClient.subscribeToResponseOf('list-products');
    this.productClient.subscribeToResponseOf('get-product');
    this.productClient.subscribeToResponseOf('update-product');
    this.productClient.subscribeToResponseOf('delete-product');
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

  list(params?: {
    user: IAuthUser;
    page: number;
    orderBy?: string;
    order?: string;
    search?: string;
  }) {
    const { user, page, order, orderBy, search } = params;
    return this.productClient
      .send(
        'list-products',
        JSON.stringify({ userId: user?.id, page, orderBy, order, search }),
      )
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  get(params?: { user: IAuthUser; id: string }) {
    const { user, id } = params;
    return this.productClient
      .send('get-product', JSON.stringify({ userId: user?.id, id }))
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  update(id: string, updateProductDto: UpdateProductDto, user: IAuthUser) {
    return this.productClient
      .send(
        'update-product',
        JSON.stringify({ ...updateProductDto, id, userId: user.id }),
      )
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  delete(id: string) {
    return this.productClient
      .send('delete-product', JSON.stringify({ id }))
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { ConnectStripeDto } from '@repo/shared';
import { catchError, throwError } from 'rxjs';
import { IAuthUser } from 'src/auth/auth.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_MICROSERVICE') private readonly userClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.userClient.subscribeToResponseOf('connect-stripe');
    this.userClient.subscribeToResponseOf('get-stripe');
    await this.userClient.connect();
  }

  async onModuleDestroy() {
    await this.userClient.close();
  }

  getStripe(user: IAuthUser) {
    return this.userClient
      .send('get-stripe', JSON.stringify({ userId: user.id }))
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  connectStripe(connectStripeDto: ConnectStripeDto, user: IAuthUser) {
    return this.userClient
      .send(
        'connect-stripe',
        JSON.stringify({ userId: user.id, ...connectStripeDto }),
      )
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }
}

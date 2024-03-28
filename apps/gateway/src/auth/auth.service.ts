import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { CreateUserDto, LoginUserDto } from '@repo/shared';
import { catchError, throwError } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_MICROSERVICE') private readonly authClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.authClient.subscribeToResponseOf('create-user');
    this.authClient.subscribeToResponseOf('login-user');
    this.authClient.subscribeToResponseOf('verify-email');
    await this.authClient.connect();
  }

  async onModuleDestroy() {
    await this.authClient.close();
  }

  async register(createUserDto: CreateUserDto): Promise<any> {
    return this.authClient
      .send('create-user', JSON.stringify(createUserDto))
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  async login(loginUserDto: LoginUserDto): Promise<any> {
    return this.authClient
      .send('login-user', JSON.stringify(loginUserDto))
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  async verify(token: string): Promise<any> {
    return this.authClient
      .send('verify-email', JSON.stringify({ token }))
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'auth',
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: 'auth-consumer',
          sessionTimeout: 30000,
          heartbeatInterval: 5000,
        },
      },
    },
  );
  await app.listen();
}
bootstrap();

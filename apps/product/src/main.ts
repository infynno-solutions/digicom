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
          clientId: 'product',
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: 'product-consumer',
          sessionTimeout: 30000,
          heartbeatInterval: 5000,
        },
      },
    },
  );
  await app.listen();
}
bootstrap();

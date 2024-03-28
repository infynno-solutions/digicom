import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MAIL_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'mail',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'mail-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

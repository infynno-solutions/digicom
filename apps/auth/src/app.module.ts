import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import * as Joi from 'joi';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
      }),
    }),
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
            sessionTimeout: 30000,
            heartbeatInterval: 5000,
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [JwtService, ConfigService],
})
export class AppModule {}

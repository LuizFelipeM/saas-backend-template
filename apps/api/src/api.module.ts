import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { WebhooksController } from './webhooks/webhooks.controller';
import { PaymentsController } from './payments/payments.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/api/.env',
      validationSchema: Joi.object({
        DB_CONNECTION_STRING: Joi.string().required(),
        SERVICES_URL: Joi.string().required(),
      }),
    }),
  ],
  controllers: [WebhooksController, PaymentsController],
  providers: [],
})
export class ApiModule {}

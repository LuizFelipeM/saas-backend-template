import { Module } from '@nestjs/common';
import { PaymentsModule } from '../payments/payments.module';
import { UsersModule } from '../users/users.module';
import { WebhooksController } from './webhooks.controller';

@Module({
  imports: [UsersModule, PaymentsModule],
  controllers: [WebhooksController],
})
export class WebhooksModule {}

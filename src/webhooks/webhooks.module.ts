import { Module } from '@nestjs/common';
import { PaymentsModule } from 'src/payments/payments.module';
import { UsersModule } from 'src/users/users.module';
import { WebhooksController } from './webhooks.controller';

@Module({
  imports: [UsersModule, PaymentsModule],
  controllers: [WebhooksController],
})
export class WebhooksModule {}

import { Exchanges, RmqModule } from '@common';
import { Module } from '@nestjs/common';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { WebhooksController } from './webhooks/webhooks.controller';

@Module({
  imports: [
    RmqModule.forRoot({ exchanges: [Exchanges.events] }),
    AuthenticationModule,
  ],
  controllers: [PaymentsController, WebhooksController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}

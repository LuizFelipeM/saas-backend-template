import { Module } from '@nestjs/common';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { HealthcheckController } from './healthcheck/healthcheck.controller';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { WebhooksController } from './webhooks/webhooks.controller';

@Module({
  imports: [AuthenticationModule],
  controllers: [HealthcheckController, PaymentsController, WebhooksController],
  providers: [PaymentsService],
})
export class PaymentsModule {}

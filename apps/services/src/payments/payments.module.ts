import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from '../authentication/authentication.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { UsersModule } from '../users/users.module';
import { PlanEntity } from './entities/plan.entity';
import { CustomerSubscriptionEventHandler } from './event-handlers/customer-subscription/customer-subscription.event-handler';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PlanRepository } from './repositories/plan.repository';
import { WebhooksController } from './webhooks/webhooks.controller';
import { WebhooksService } from './webhooks/webhooks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlanEntity]),
    AuthenticationModule,
    OrganizationsModule,
    UsersModule,
  ],
  controllers: [PaymentsController, WebhooksController],
  providers: [
    PaymentsService,
    CustomerSubscriptionEventHandler,
    PlanRepository,
    WebhooksService,
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}

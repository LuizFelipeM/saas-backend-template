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

@Module({
  imports: [
    TypeOrmModule.forFeature([PlanEntity]),
    AuthenticationModule,
    OrganizationsModule,
    UsersModule,
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    CustomerSubscriptionEventHandler,
    PlanRepository,
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}

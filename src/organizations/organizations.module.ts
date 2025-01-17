import { Module } from '@nestjs/common';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { UsersModule } from 'src/users/users.module';
import { MessageBrokerHandlerController } from './message-broker-handler/message-broker-handler.controller';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';

@Module({
  imports: [AuthenticationModule, UsersModule],
  providers: [MessageBrokerHandlerController, OrganizationsService],
  controllers: [OrganizationsController, MessageBrokerHandlerController],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}

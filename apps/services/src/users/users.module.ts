import { Module } from '@nestjs/common';
import { AuthenticationModule } from '../authentication/authentication.module';
import { UsersService } from './users.service';
import { WebhooksController } from './webhooks/webhooks.controller';
import { WebhooksService } from './webhooks/webhooks.service';

@Module({
  imports: [AuthenticationModule],
  providers: [UsersService, WebhooksService],
  controllers: [WebhooksController],
  exports: [UsersService],
})
export class UsersModule {}

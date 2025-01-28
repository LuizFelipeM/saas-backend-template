import { Module } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';

@Module({
  controllers: [],
  providers: [AuthorizationService],
  exports: [AuthorizationService],
})
export class AuthorizationModule {}

import { Module } from '@nestjs/common';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';

@Module({
  imports: [AuthenticationModule],
  providers: [OrganizationsService],
  controllers: [OrganizationsController],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}

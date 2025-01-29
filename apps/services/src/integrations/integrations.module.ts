import { Module } from '@nestjs/common';
import { CrmModule } from './crm/crm.module';
import { EmailModule } from './email/email.module';
import { ErpModule } from './erp/erp.module';
import { IntegrationsService } from './integrations.service';

@Module({
  imports: [EmailModule, CrmModule, ErpModule],
  providers: [IntegrationsService],
})
export class IntegrationsModule {}

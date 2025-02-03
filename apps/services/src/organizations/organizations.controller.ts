import { Organization } from '@clerk/backend';
import { Body, Controller, Logger, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UpdateOrganizationDto } from './dtos/update-organization.dto';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
@UseGuards(JwtAuthGuard)
export class OrganizationsController {
  private readonly logger = new Logger(OrganizationsController.name);

  constructor(private readonly organizationsService: OrganizationsService) {}

  @Put()
  async update(@Body() params: UpdateOrganizationDto): Promise<Organization> {
    try {
      return await this.organizationsService.update(params);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}

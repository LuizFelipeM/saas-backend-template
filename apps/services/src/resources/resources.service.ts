import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  CreateResourceRequest,
  DeleteResourceRequest,
  ResourceTypes,
  UpdateResourceRequest,
} from '@protos/resources.service';
import { Permit } from 'permitio';
import { ResourceInstanceRead } from 'permitio/build/main/openapi';
import { PERMIT_CLIENT } from '../clients';

@Injectable()
export class ResourcesService {
  private readonly logger = new Logger(ResourcesService.name);

  constructor(@Inject(PERMIT_CLIENT) private readonly permitClient: Permit) {}

  async create(resource: CreateResourceRequest): Promise<ResourceInstanceRead> {
    try {
      return await this.permitClient.api.resourceInstances.create({
        key: resource.id,
        resource: ResourceTypes[resource.type],
        attributes: resource.attributes,
        tenant: resource.organizationId,
      });
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw error;
    }
  }

  async update(resource: UpdateResourceRequest): Promise<ResourceInstanceRead> {
    try {
      return await this.permitClient.api.resourceInstances.update(resource.id, {
        attributes: resource.attributes,
      });
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw error;
    }
  }

  async delete(resource: DeleteResourceRequest): Promise<void> {
    try {
      await this.permitClient.api.resourceInstances.delete(resource.id);
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw error;
    }
  }
}

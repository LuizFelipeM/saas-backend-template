import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  CreateResourceRequest,
  DeleteResourceRequest,
  ResourceTypes,
  UpdateResourceRequest,
} from '@protos/resources.service';
import { PERMIT_CLIENT } from '@services/clients';
import { Permit } from 'permitio';
import { ResourceInstanceRead } from 'permitio/build/main/openapi';

@Injectable()
export class ResourcesService {
  private readonly logger = new Logger(ResourcesService.name);

  constructor(@Inject(PERMIT_CLIENT) private readonly permitClient: Permit) {}

  async create(resource: CreateResourceRequest): Promise<ResourceInstanceRead> {
    try {
      this.logger.log(`Input ${JSON.stringify(resource)}`);
      const config = {
        key: resource.id,
        resource: ResourceTypes[resource.type],
        attributes: resource.attributes,
        tenant: resource.organizationId,
      };
      this.logger.log(`Input ${JSON.stringify(resource)}`);
      return await Promise.resolve({
        created_at,
        environment_id,
        key,
      });
      // return await this.permitClient.api.resourceInstances.create(config);
    } catch (error) {
      this.logger.error(JSON.stringify(error));
    }
  }

  async update(resource: UpdateResourceRequest): Promise<ResourceInstanceRead> {
    try {
      return await this.permitClient.api.resourceInstances.update(resource.id, {
        attributes: resource.attributes,
      });
    } catch (error) {
      this.logger.error(JSON.stringify(error));
    }
  }

  async delete(resource: DeleteResourceRequest): Promise<void> {
    await this.permitClient.api.resourceInstances.delete(resource.id);
  }
}

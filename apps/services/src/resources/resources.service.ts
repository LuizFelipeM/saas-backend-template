import { Inject, Injectable } from '@nestjs/common';
import { PERMIT_CLIENT } from '@services/clients';
import {
  CreateResourceDto,
  DeleteResourceDto,
  ResourceCreatedDto,
  ResourceUpdatedDto,
  UpdateResourceDto,
} from '@services/contracts/resource';
import { Permit } from 'permitio';

@Injectable()
export class ResourcesService {
  constructor(@Inject(PERMIT_CLIENT) private readonly permitClient: Permit) {}

  async create(resource: CreateResourceDto): Promise<ResourceCreatedDto> {
    const res = await this.permitClient.api.resourceInstances.create({
      key: resource.id,
      resource: resource.type,
      attributes: resource.attributes,
      tenant: resource.organizationId,
    });

    return new ResourceCreatedDto(res);
  }

  async update(resource: UpdateResourceDto): Promise<ResourceUpdatedDto> {
    const res = await this.permitClient.api.resourceInstances.update(
      resource.id,
      {
        attributes: resource.attributes,
      },
    );

    return new ResourceUpdatedDto(res);
  }

  async delete(resource: DeleteResourceDto): Promise<void> {
    await this.permitClient.api.resourceInstances.delete(resource.id);
  }
}

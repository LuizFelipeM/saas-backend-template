import { Controller, Logger } from '@nestjs/common';
import {
  CreateResourceRequest,
  CreateResourceResponse,
  DeleteResourceRequest,
  DeleteResourceResponse,
  ResourcesServiceController,
  ResourcesServiceControllerMethods,
  UpdateResourceRequest,
  UpdateResourceResponse,
} from '@protos/resources.service';
import { ResourcesService } from './resources.service';

@Controller()
@ResourcesServiceControllerMethods()
export class ResourcesController implements ResourcesServiceController {
  private readonly logger = new Logger(ResourcesController.name);

  constructor(private readonly resourcesService: ResourcesService) {}

  async create(
    request: CreateResourceRequest,
  ): Promise<CreateResourceResponse> {
    const result = await this.resourcesService.create(request);
    return {
      id: result.id,
      organizationId: result.tenant,
      attributes: Object.entries(result.attributes ?? {}).reduce(
        (acc, [key, value]) => ({ ...acc, [key]: value }),
        {},
      ),
    };
  }

  async update(
    request: UpdateResourceRequest,
  ): Promise<UpdateResourceResponse> {
    const result = await this.resourcesService.update(request);
    return {
      id: result.id,
      organizationId: result.tenant,
      attributes: Object.entries(result.attributes ?? {}).reduce(
        (acc, [key, value]) => ({ ...acc, [key]: value }),
        {},
      ),
    };
  }

  async delete(
    request: DeleteResourceRequest,
  ): Promise<DeleteResourceResponse> {
    await this.resourcesService.delete(request);
    return {};
  }
}

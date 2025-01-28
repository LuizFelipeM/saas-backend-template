import { Body, Controller, Inject, OnModuleInit, Post } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  CreateResourceRequest,
  RESOURCES_SERVICE_NAME,
  ResourcesServiceClient,
  SERVICES_PACKAGE_NAME,
} from '@protos/resources.service';

@Controller('resources')
export class ResourcesController implements OnModuleInit {
  private resourcesServiceClient: ResourcesServiceClient;

  constructor(
    @Inject(SERVICES_PACKAGE_NAME)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.resourcesServiceClient =
      this.client.getService<ResourcesServiceClient>(RESOURCES_SERVICE_NAME);
  }

  @Post()
  create(@Body() payload: CreateResourceRequest) {
    return this.resourcesServiceClient.create(payload);
  }
}

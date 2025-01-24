import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  CreateResourceRequest,
  CreateResourceResponse,
  RESOURCES_SERVICE_NAME,
  ResourcesServiceClient,
  SERVICES_PACKAGE_NAME,
} from '@protos/resources.service';
import { Observable } from 'rxjs';

@Injectable()
export class ApiService implements OnModuleInit {
  private resourcesServiceClient: ResourcesServiceClient;

  constructor(
    @Inject(SERVICES_PACKAGE_NAME)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.resourcesServiceClient =
      this.client.getService<ResourcesServiceClient>(RESOURCES_SERVICE_NAME);
  }

  create(request: CreateResourceRequest): Observable<CreateResourceResponse> {
    return this.resourcesServiceClient.create(request);
  }
}

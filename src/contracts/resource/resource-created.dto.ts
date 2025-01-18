import { ResourceInstanceRead } from 'permitio/build/main/openapi';

export class ResourceCreatedDto {
  id: string;
  organizationId: string;
  attributes: Record<string, unknown>;

  constructor(resource: ResourceInstanceRead) {
    this.id = resource.key;
    this.organizationId = String(resource.tenant);
    this.attributes = resource.attributes as Record<string, unknown>;
  }
}

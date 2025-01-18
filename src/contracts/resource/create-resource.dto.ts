import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ResourceTypes } from './resource-types';

export class CreateResourceDto {
  @IsUUID('4')
  @IsNotEmpty()
  id: string;

  @IsEnum(ResourceTypes)
  @IsNotEmpty()
  type: ResourceTypes;

  @IsString()
  @IsNotEmpty()
  organizationId: string;

  /**
   * Resource extra attributes.
   *
   * These attributes can be used in authorization checks
   */
  attributes?: Record<string, unknown>;
}

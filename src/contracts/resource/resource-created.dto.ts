import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { randomUUID } from 'crypto';
import { ResourceTypes } from './resource-types';

export class ResourceCreatedDto {
  get id(): string {
    return randomUUID();
  }

  /**
   * Type of resource
   */
  @IsEnum(ResourceTypes)
  @IsNotEmpty()
  type: ResourceTypes;

  /**
   * Resource name must be unique
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * User executing the action on the resource
   */
  @IsString()
  @IsNotEmpty()
  userId: string;

  /**
   * Resource extra attributes
   */
  attributes?: Record<string, unknown>;
}

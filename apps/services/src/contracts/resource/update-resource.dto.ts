import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateResourceDto {
  @IsUUID('4')
  @IsNotEmpty()
  id: string;

  /**
   * Resource extra attributes.
   *
   * These attributes can be used in authorization checks
   */
  attributes?: Record<string, unknown>;
}

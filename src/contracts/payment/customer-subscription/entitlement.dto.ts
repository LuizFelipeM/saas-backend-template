import { IsNotEmpty, IsString } from 'class-validator';

export class EntitlementDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  attributes?: Record<string, unknown>;
}

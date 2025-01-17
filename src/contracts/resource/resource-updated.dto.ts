import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { ResourceCreatedDto } from './resource-created.dto';

export class ResourceUpdatedDto extends PartialType(
  OmitType(ResourceCreatedDto, ['id', 'name'] as const),
) {
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => !o.name)
  id?: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => !o.resourceId)
  name?: string;
}

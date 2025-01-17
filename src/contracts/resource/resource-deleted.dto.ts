import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class ResourceDeletedDto {
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => !o.name)
  id?: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => !o.resourceId)
  name?: string;
}

import { StringUtils } from '@libs/common/utils/string.utils';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  maxUsers: number;

  attributes?: Record<string, unknown>;

  get slug(): string | undefined {
    return this.name ? StringUtils.kebabize(this.name) : undefined;
  }
}

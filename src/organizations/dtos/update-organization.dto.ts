import { StringUtils } from '@common/utils/string.utils';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  name?: string;

  maxUsers?: number;

  attributes?: Record<string, unknown>;

  get slug(): string | undefined {
    return this.name ? StringUtils.kebabize(this.name) : undefined;
  }
}

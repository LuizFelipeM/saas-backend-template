import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { StringUtils } from '../../common/utils/string.utils';

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

import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '../role';

export class SyncUserDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  organizationId: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsEnum(Role, { each: true })
  roles?: Role[];

  attributes?: Record<string, any>;
}

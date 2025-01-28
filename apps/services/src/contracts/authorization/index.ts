import { IsNotEmpty, IsString } from 'class-validator';

export class AuthorizationCheckDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  action: string;

  @IsString()
  @IsNotEmpty()
  resource: string;
}

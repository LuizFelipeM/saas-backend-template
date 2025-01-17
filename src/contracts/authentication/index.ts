import { IsJWT, IsNotEmpty, IsString } from 'class-validator';

export class AuthVerifyDto {
  @IsJWT()
  @IsNotEmpty()
  authorization: string;
}

export class GetUserDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}

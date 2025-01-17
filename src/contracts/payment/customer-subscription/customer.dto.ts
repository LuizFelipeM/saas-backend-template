import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CustomerDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

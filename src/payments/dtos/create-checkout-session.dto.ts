import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCheckoutSessionDto {
  @IsString()
  @IsNotEmpty()
  lookupKey: string;
}

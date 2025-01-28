import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class SendEmailDto {
  @IsString()
  @IsNotEmpty()
  receipient: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsArray()
  attachments?: string[];
}

import { IsNotEmpty, IsString } from 'class-validator';

export class SaveInboxDto {
  receivedDate: Date;

  @IsString()
  @IsNotEmpty()
  sender: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  attachments: any[];
}

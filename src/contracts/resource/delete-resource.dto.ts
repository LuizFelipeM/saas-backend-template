import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteResourceDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}

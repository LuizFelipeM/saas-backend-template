import { IsNotEmpty, IsString } from 'class-validator';

export class QuestionDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsNotEmpty()
  answer: unknown;

  metadata: unknown;
}

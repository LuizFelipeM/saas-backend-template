import { IsArray } from 'class-validator';
import { QuestionDto } from './question.dto';

export class AnswerSurveyDto {
  @IsArray()
  content: QuestionDto[];
}

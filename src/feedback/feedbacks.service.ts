import { Injectable } from '@nestjs/common';
import { AnswerSurveyDto } from './dtos/answer-survey.dto';
import { Question, Survey } from './entities/survey.entity';
import { SurveyRepository } from './repositories/survey.repository';

@Injectable()
export class FeedbacksService {
  constructor(private readonly surveyRepository: SurveyRepository) {}

  async answer(userId: string, answerSurvey: AnswerSurveyDto): Promise<void> {
    const survey = new Survey();
    survey.createdAt = new Date();
    survey.userId = userId;
    survey.content = answerSurvey.content.map(
      ({ answer, label, metadata }) => new Question(label, answer, metadata),
    );
    await this.surveyRepository.insert(survey);
  }
}

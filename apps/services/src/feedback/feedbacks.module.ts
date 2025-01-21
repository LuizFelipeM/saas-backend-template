import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from '../authentication/authentication.module';
import { SurveyEntity } from './entities/survey.entity';
import { FeedbacksController } from './feedbacks.controller';
import { FeedbacksService } from './feedbacks.service';
import { HealthcheckController } from './healthcheck/healthcheck.controller';
import { SurveyRepository } from './repositories/survey.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SurveyEntity]), AuthenticationModule],
  controllers: [HealthcheckController, FeedbacksController],
  providers: [FeedbacksService, SurveyRepository],
  exports: [TypeOrmModule],
})
export class FeedbacksModule {}

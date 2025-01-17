import { DatabaseModule } from '@common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { Survey } from './entities/survey.entity';
import { FeedbacksController } from './feedbacks.controller';
import { FeedbacksService } from './feedbacks.service';
import { HealthcheckController } from './healthcheck/healthcheck.controller';
import { SurveyRepository } from './repositories/survey.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/feedback/.env',
      validationSchema: Joi.object({
        DB_CONNECTION_STRING: Joi.string().required(),
        RABBIT_MQ_URL: Joi.string().required(),
      }),
    }),
    AuthenticationModule,
    DatabaseModule.forRoot({
      entities: [Survey],
    }),
  ],
  controllers: [HealthcheckController, FeedbacksController],
  providers: [FeedbacksService, SurveyRepository],
})
export class FeedbacksModule {}

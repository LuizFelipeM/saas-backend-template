import { AbstractRepository } from '@common';
import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Survey } from '../entities/survey.entity';

@Injectable()
export class SurveyRepository extends AbstractRepository<Survey> {
  protected readonly logger = new Logger(SurveyRepository.name);

  constructor(dataSource: DataSource) {
    super(dataSource.getRepository<Survey>(Survey));
  }
}

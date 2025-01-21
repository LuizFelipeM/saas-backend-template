import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from '@services/common';
import { Repository } from 'typeorm';
import { SurveyEntity } from '../entities/survey.entity';

@Injectable()
export class SurveyRepository extends AbstractRepository<SurveyEntity> {
  protected readonly logger = new Logger(SurveyRepository.name);

  constructor(
    @InjectRepository(SurveyEntity) repository: Repository<SurveyEntity>,
  ) {
    super(repository);
  }
}

import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractRepository } from '../../common';
import { PlanEntity } from '../entities/plan.entity';

export class PlanRepository extends AbstractRepository<PlanEntity> {
  protected readonly logger = new Logger(PlanRepository.name);

  constructor(
    @InjectRepository(PlanEntity) repository: Repository<PlanEntity>,
  ) {
    super(repository);
  }
}

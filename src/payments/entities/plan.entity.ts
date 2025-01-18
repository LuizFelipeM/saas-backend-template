import { AbstractEntity } from '@common';
import { Column } from 'typeorm';

export class PlanEntity extends AbstractEntity {
  @Column('min')
  min: number;

  @Column('max')
  max?: number;
}

import { Column } from 'typeorm';
import { AbstractEntity } from '../../common';

export class PlanEntity extends AbstractEntity {
  @Column('min')
  min: number;

  @Column('max')
  max?: number;
}

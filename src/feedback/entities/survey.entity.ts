import { AbstractEntity } from '@common';
import { Column, Entity } from 'typeorm';

export class Question {
  label: string;
  answer: unknown;
  metadata: unknown;

  constructor();
  constructor(label: string, answer: unknown, metadata: unknown);
  constructor(label?: string, answer?: unknown, metadata?: unknown) {
    this.label = label;
    this.answer = answer;
    this.metadata = metadata;
  }
}

@Entity({ name: 'survey' })
export class Survey extends AbstractEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'content', type: 'jsonb' })
  content: Question[];
}

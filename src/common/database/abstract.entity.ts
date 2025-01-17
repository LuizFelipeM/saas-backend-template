import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export abstract class AbstractEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;
}

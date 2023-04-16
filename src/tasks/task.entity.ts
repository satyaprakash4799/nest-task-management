import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'Task' })
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: string;
}

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @Column()
  date: Date;
}

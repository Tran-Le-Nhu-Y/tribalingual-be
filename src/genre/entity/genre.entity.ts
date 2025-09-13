import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class GenreEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;
}

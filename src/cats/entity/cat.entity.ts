import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class CatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  breed: string;

  @Column({ default: true })
  isOrange: boolean;
}

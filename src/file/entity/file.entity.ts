import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  mime_type: string;

  @Column()
  save_path: string;
}

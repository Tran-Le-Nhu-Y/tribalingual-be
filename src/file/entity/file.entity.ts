import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  mime_type: string;

  @Column()
  size: number;

  @Column()
  url: string;

  @Column()
  publicId: string; //  cloudinary
}

import { Exclude } from 'class-transformer';
import StoryEntity from 'src/story/entity/story.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';

@Entity()
export default class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  storyId?: string;

  @Column()
  name: string;

  @Column()
  mime_type: string;

  @Column()
  size: number;

  @Column()
  url: string;

  @Column()
  save_path: string; //  cloudinary

  // File là owner, có FK storyId
  @OneToOne(() => StoryEntity, (story) => story.file, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storyId' })
  @Exclude()
  story?: StoryEntity;
}

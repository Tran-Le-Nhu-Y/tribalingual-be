import StoryEntity from 'src/story/entity/story.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export default class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @PrimaryColumn('uuid')
  storyId: string;

  @Column()
  filename: string;

  @Column()
  mime_type: string;

  @Column()
  size: number;

  @Column()
  url: string;

  @Column()
  save_path: string; //  cloudinary

  @OneToOne(() => StoryEntity, (story) => story.file, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storyId' })
  story: StoryEntity;
}

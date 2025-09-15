import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import StoryEntity from './story.entity';

@Entity()
export class StoryContentEntity {
  @PrimaryColumn('uuid')
  storyId: string;

  @Column({ type: 'text' })
  hmong: string;

  @Column({ type: 'text' })
  english: string;

  @Column({ type: 'text' })
  vietnamese: string;

  @ManyToOne(() => StoryEntity, (story) => story.favorites, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'storyId' })
  story: StoryEntity;
}

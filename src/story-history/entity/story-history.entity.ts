import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import StoryEntity from '../../story/entity/story.entity';
import { UserEntity } from 'src/user/entity/user.entity';

export enum StoryAction {
  CREATED = 'created',
  UPDATED = 'updated',
  PUBLISHED = 'published',
  REJECTED = 'rejected',
  DELETED = 'deleted',
}

@Entity()
@Index('idx_story_history_storyId', ['storyId'])
@Index('idx_story_history_userId', ['userId'])
export class StoryHistoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  storyId: string;

  @Column('uuid')
  userId: string;

  @Column({ type: 'enum', enum: StoryAction })
  action: StoryAction;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => StoryEntity, (story) => story.histories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'storyId' })
  story: StoryEntity;

  @ManyToOne(() => UserEntity, (user) => user.histories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}

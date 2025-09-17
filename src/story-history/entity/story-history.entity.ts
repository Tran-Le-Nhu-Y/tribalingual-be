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
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  PUBLISHED = 'PUBLISHED',
  REJECTED = 'REJECTED',
  DELETED = 'DELETED',
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
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'storyId' })
  story: StoryEntity;

  @ManyToOne(() => UserEntity, (user) => user.histories, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  // Snapshot story data
  @Column({ type: 'text', nullable: true })
  storyTitle: string;

  @Column({ type: 'uuid', nullable: true })
  storyAuthorId: string;

  @Column({ type: 'timestamp', nullable: true })
  storyPublishedDate: Date;
}

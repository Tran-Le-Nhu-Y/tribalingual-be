import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import StoryEntity from './story.entity';
import { UserEntity } from 'src/user/entity/user.entity';

@Entity()
export class ViewEntity {
  @PrimaryColumn('uuid')
  storyId: string;

  @PrimaryColumn('uuid')
  userId: string;

  @Column({ type: 'timestamp' })
  lastViewDate: Date;

  @ManyToOne(() => StoryEntity, (story) => story.views, {
    onDelete: 'CASCADE',
  })
  story: StoryEntity;

  @ManyToOne(() => UserEntity, (user) => user.views, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
}

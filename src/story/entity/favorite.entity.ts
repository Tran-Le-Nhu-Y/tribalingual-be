import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import StoryEntity from './story.entity';
import { UserEntity } from 'src/user/entity/user.entity';

@Entity()
export class FavoriteEntity {
  @PrimaryColumn('uuid')
  storyId: string;

  @PrimaryColumn('uuid')
  userId: string;

  @Column({ type: 'timestamp' })
  addedDate: Date;

  @ManyToOne(() => StoryEntity, (story) => story.favorites, {
    onDelete: 'CASCADE',
  })
  story: StoryEntity;

  @ManyToOne(() => UserEntity, (user) => user.favorites, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
}

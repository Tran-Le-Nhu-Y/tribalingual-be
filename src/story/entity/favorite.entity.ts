import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import StoryEntity from './story.entity';
import { UserEntity } from 'src/user/entity/user.entity';

@Entity()
export class FavoriteEntity {
  @PrimaryColumn('uuid')
  storyId: string;

  @PrimaryColumn({ type: 'varchar' })
  userId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  addedDate: Date;

  @ManyToOne(() => StoryEntity, (story) => story.favorites, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'storyId' })
  story: StoryEntity;

  @ManyToOne(() => UserEntity, (user) => user.favorites, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}

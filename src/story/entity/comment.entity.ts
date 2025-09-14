import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import StoryEntity from './story.entity';
import { UserEntity } from 'src/user/entity/user.entity';

@Entity()
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => StoryEntity, (story) => story.comments, {
    onDelete: 'CASCADE',
  })
  story: StoryEntity;

  @ManyToOne(() => UserEntity, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
}

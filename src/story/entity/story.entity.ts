import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { ViewEntity } from './view.entity';
import { FavoriteEntity } from './favorite.entity';
import { StoryHistoryEntity } from 'src/story-history/entity/story-history.entity';

export enum StoryStatus {
  PENDING = 'PENDING',
  PUBLISHED = 'PUBLISHED',
  REJECTED = 'REJECTED',
  HIDDEN = 'HIDDEN',
}
@Entity()
export default class StoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'uuid' })
  authorId: string;

  @Column({ type: 'timestamp' })
  publishedDate: Date;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  commentCount: number;

  @Column({ default: 0 })
  favoriteCount: number;

  @OneToMany(() => CommentEntity, (comment) => comment.story)
  comments: CommentEntity[];

  @OneToMany(() => ViewEntity, (view) => view.story)
  views: ViewEntity[];

  @OneToMany(() => FavoriteEntity, (favorite) => favorite.story)
  favorites: FavoriteEntity[];

  @OneToMany(() => StoryHistoryEntity, (history) => history.story)
  histories: StoryHistoryEntity[];
}

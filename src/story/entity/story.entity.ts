import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { ViewEntity } from './view.entity';
import { FavoriteEntity } from './favorite.entity';

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
}

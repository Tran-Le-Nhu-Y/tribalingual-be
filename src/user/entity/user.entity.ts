import { StoryHistoryEntity } from 'src/story-history/entity/story-history.entity';
import { CommentEntity } from 'src/story/entity/comment.entity';
import { FavoriteEntity } from 'src/story/entity/favorite.entity';
import { ViewEntity } from 'src/story/entity/view.entity';
import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  picture?: string;

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];

  @OneToMany(() => ViewEntity, (view) => view.user)
  views: ViewEntity[];

  @OneToMany(() => FavoriteEntity, (favorite) => favorite.user)
  favorites: FavoriteEntity[];

  @OneToMany(() => StoryHistoryEntity, (history) => history.user)
  histories: StoryHistoryEntity[];
}

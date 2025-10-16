import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { CommentEntity } from './comment.entity';
import { ViewEntity } from './view.entity';
import { FavoriteEntity } from './favorite.entity';
import { StoryHistoryEntity } from 'src/story-history/entity/story-history.entity';
import GenreEntity from 'src/genre/entity/genre.entity';
import FileEntity from 'src/file/entity/file.entity';

export enum StoryStatus {
  PENDING = 'PENDING',
  PUBLISHED = 'PUBLISHED',
  REJECTED = 'REJECTED',
  HIDDEN = 'HIDDEN',
  UPDATED = 'UPDATED',
}

export enum Language {
  HMONG = 'HMONG',
  ENGLISH = 'ENGLISH',
  VIETNAMESE = 'VIETNAMESE',
}
@Entity()
export default class StoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  authorId: string;

  @Column({ type: 'varchar', nullable: true })
  adminId?: string;

  @Column({ type: 'uuid' })
  genreId: string;

  @Column({ type: 'uuid', nullable: true })
  fileId?: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: Language, default: Language.VIETNAMESE })
  language: Language;

  @Column({ type: 'text', nullable: true })
  hmongContent?: string;

  @Column({ type: 'text', nullable: true })
  englishContent?: string;

  @Column({ type: 'text', nullable: true })
  vietnameseContent?: string;

  @Column({ type: 'enum', enum: StoryStatus, default: StoryStatus.PENDING })
  status: StoryStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploadedDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  publishedDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastUpdatedDate: Date;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  commentCount: number;

  @Column({ default: 0 })
  favoriteCount: number;

  @OneToMany(() => CommentEntity, (comment) => comment.story, { eager: true })
  comments: CommentEntity[];

  @OneToMany(() => ViewEntity, (view) => view.story)
  views: ViewEntity[];

  @OneToMany(() => FavoriteEntity, (favorite) => favorite.story)
  favorites: FavoriteEntity[];

  @OneToMany(() => StoryHistoryEntity, (history) => history.story)
  histories: StoryHistoryEntity[];

  @ManyToOne(() => GenreEntity, (genre) => genre.stories, { eager: true })
  genre: GenreEntity;

  @OneToOne(() => FileEntity, (file) => file.story, {
    cascade: true,
    nullable: true,
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'fileId' })
  file?: FileEntity | null;
}

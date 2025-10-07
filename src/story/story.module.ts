import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import StoryEntity from './entity/story.entity';
import { StoryController } from './story.controller';
import { StoryService } from './story.service';
import { StoryMapper } from './mapper/story.mapper';
import { CommentEntity } from './entity/comment.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { ViewEntity } from './entity/view.entity';
import { FavoriteEntity } from './entity/favorite.entity';
import { CommentMapper } from './mapper/comment.mapper';
import { StoryHistoryEntity } from 'src/story-history/entity/story-history.entity';
import GenreEntity from 'src/genre/entity/genre.entity';
import FileEntity from 'src/file/entity/file.entity';
import { FileMapper } from 'src/file/file.mapper';
import { GenreMapper } from 'src/genre/genre.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      CommentEntity,
      ViewEntity,
      FavoriteEntity,
      StoryEntity,
      StoryHistoryEntity,
      GenreEntity,
      FileEntity,
    ]),
  ],
  controllers: [StoryController],
  providers: [
    StoryService,
    StoryMapper,
    CommentMapper,
    FileMapper,
    GenreMapper,
  ],
  exports: [StoryService],
})
export class StoryModule {}

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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      CommentEntity,
      ViewEntity,
      FavoriteEntity,
      StoryEntity,
    ]),
  ],
  controllers: [StoryController],
  providers: [StoryService, StoryMapper],
  exports: [StoryService],
})
export class StoryModule {}

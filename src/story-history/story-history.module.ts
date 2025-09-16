import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoryHistoryEntity } from './entity/story-history.entity';
import { StoryHistoryController } from './story-history.controller';
import { StoryHistoryService } from './story-history.service';
import { StoryHistoryMapper } from './story-content.mapper';
import StoryEntity from 'src/story/entity/story.entity';
import { UserEntity } from 'src/user/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StoryHistoryEntity, StoryEntity, UserEntity]),
  ],
  controllers: [StoryHistoryController],
  providers: [StoryHistoryService, StoryHistoryMapper],
  exports: [StoryHistoryService],
})
export class StoryHistoryModule {}

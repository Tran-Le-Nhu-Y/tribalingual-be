import { Injectable } from '@nestjs/common';
import { StoryHistoryEntity } from './entity/story-history.entity';
import StoryResponse from 'src/story/dto/story-response.dto';
import StoryHistoryResponse from './dto/story-history-response.dto';

@Injectable()
export class StoryHistoryMapper {
  toResponse(entity: StoryHistoryEntity): StoryHistoryResponse {
    return {
      id: entity.id,
      action: entity.action,
      userId: entity.userId,
      createdAt: entity.createdAt,
      story: {
        id: entity.story?.id,
        title: entity.story?.title,
      } as StoryResponse,
    };
  }

  toResponseList(entities: StoryHistoryEntity[]): StoryHistoryResponse[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}

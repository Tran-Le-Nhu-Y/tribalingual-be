import { Injectable } from '@nestjs/common';
import StoryEntity from '../entity/story.entity';
import Story from '../interface/story.interface';
import StoryResponse from '../dto/story-response.dto';

@Injectable()
export class StoryMapper {
  toModel(entity: StoryEntity) {
    return {
      id: entity.id,
      title: entity.title,
      authorId: entity.authorId,
      publishedDate: entity.publishedDate,
      viewCount: entity.viewCount,
      commentCount: entity.commentCount,
      likeCount: entity.likeCount,
    } as Story;
  }

  toResponse(model: Story) {
    return {
      ...model,
    } as StoryResponse;
  }
}

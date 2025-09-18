import { Injectable } from '@nestjs/common';
import StoryEntity from '../entity/story.entity';
import Story from '../interface/story.interface';
import StoryResponse from '../dto/story-response.dto';

@Injectable()
export class StoryMapper {
  //Entity -> Model
  toModel(entity: StoryEntity) {
    return {
      id: entity.id,
      authorId: entity.authorId,
      adminId: entity.adminId,
      genreId: entity.genreId,
      fileId: entity.fileId,
      title: entity.title,
      description: entity.description,
      language: entity.language,
      hmongContent: entity.hmongContent,
      englishContent: entity.englishContent,
      vietnameseContent: entity.vietnameseContent,
      status: entity.status,
      uploadedDate: entity.uploadedDate,
      publishedDate: entity.publishedDate,
      lastUpdatedDate: entity.lastUpdatedDate,
      viewCount: entity.viewCount,
      commentCount: entity.commentCount,
      favoriteCount: entity.favoriteCount,
    } as Story;
  }

  //Model -> DTO
  toResponse(model: Story) {
    return {
      ...model,
      hmongContent: model.hmongContent ?? '',
      englishContent: model.englishContent ?? '',
      vietnameseContent: model.vietnameseContent ?? '',
      fileUrl: model.file?.url ?? undefined,
    } as StoryResponse;
  }
}

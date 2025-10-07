import { Injectable } from '@nestjs/common';
import { CommentEntity } from '../entity/comment.entity';
import Comment from '../interface/comment.interface';
import { CommentResponse } from '../dto/comment-response.dto';

@Injectable()
export class CommentMapper {
  toModel(entity: CommentEntity): Comment {
    return {
      id: entity.id,
      content: entity.content,
      createdAt: entity.createdAt,
      storyId: entity.story?.id,
      userId: entity.user?.id,
    };
  }

  toResponse(entity: CommentEntity): CommentResponse {
    return {
      id: entity.id,
      content: entity.content,
      createdAt: entity.createdAt,
      storyId: entity.story?.id,
      userId: entity.user?.id,
    };
  }

  toResponseList(entities: CommentEntity[]): CommentResponse[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}

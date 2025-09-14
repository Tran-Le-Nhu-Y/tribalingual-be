import { Injectable } from '@nestjs/common';
import { CommentEntity } from '../entity/comment.entity';
import Comment from '../interface/comment.interface';
import { CommentResponse } from '../dto/comment-response.dto';
import StoryResponse from '../dto/story-response.dto';
import UserResponse from 'src/user/dto/user-response';

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
      story: {
        id: entity.story?.id,
        title: entity.story?.title,
      } as StoryResponse,
      user: {
        id: entity.user?.id,
        username: entity.user?.username,
      } as UserResponse,
    };
  }

  toResponseList(entities: CommentEntity[]): CommentResponse[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}

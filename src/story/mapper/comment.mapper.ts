import { Injectable } from '@nestjs/common';
import { CommentEntity } from '../entity/comment.entity';
import Comment from '../interface/comment.interface';
import { CommentResponse } from '../dto/comment-response.dto';
import { UserMapper } from 'src/user/user.mapper';

@Injectable()
export class CommentMapper {
  constructor(private readonly userMapper: UserMapper) {}
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
      user: entity.user ? this.userMapper.toResponse(entity.user) : null,
    };
  }

  toResponseList(entities: CommentEntity[]): CommentResponse[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}

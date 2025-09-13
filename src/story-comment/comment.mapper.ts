import { Injectable } from '@nestjs/common';
import CommentEntity from './entity/comment.entity';
import Comment from './interface/comment.interface';
import CommentResponse from './dto/comment-response.dto';

@Injectable()
export class CommentMapper {
  toModel(entity: CommentEntity) {
    return {
      id: entity.id,
      content: entity.content,
      date: entity.date,
    } as Comment;
  }

  toResponse(model: Comment) {
    return {
      ...model,
    } as CommentResponse;
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import CommentEntity from './entity/comment.entity';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentMapper } from './comment.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity])],
  controllers: [CommentController],
  providers: [CommentService, CommentMapper],
  exports: [CommentService],
})
export class CommentModule {}

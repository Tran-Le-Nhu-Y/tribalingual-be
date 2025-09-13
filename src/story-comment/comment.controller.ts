import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CommentMapper } from './comment.mapper';
import CommentResponse from './dto/comment-response.dto';
import CreateCommentBody from './dto/create-comment.dto';

@Controller({ path: '/api/v1/comment' })
export class CommentController {
  constructor(
    private readonly service: CommentService,
    private readonly mapper: CommentMapper,
  ) {}

  @Get('/all')
  @ApiOperation({ summary: 'Get all comments' })
  @ApiResponse({ type: [CommentResponse] })
  async getAllComments() {
    const comments = await this.service.findAll();
    return comments.map((model) => this.mapper.toResponse(model));
  }

  @Get('/comment/:id')
  @ApiOperation({ summary: 'Get comment by id' })
  async getCommentById(@Param('id') id: string) {
    const comment = await this.service.findOne(id);
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return this.mapper.toResponse(comment);
  }

  @Post('/create')
  @ApiOperation({ summary: 'Create a new comment' })
  async createComment(@Body() body: CreateCommentBody) {
    const id = await this.service.create({ ...body });
    return id;
  }

  @Delete('/delete/:id')
  @ApiOperation({ summary: 'Delete a comment by id' })
  async deleteComment(@Param('id') id: string) {
    const deleted = await this.service.remove(id);
    if (!deleted) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return { message: `Comment with id ${id} deleted successfully` };
  }
}

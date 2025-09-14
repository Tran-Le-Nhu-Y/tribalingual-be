import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StoryService } from './story.service';
import { StoryMapper } from './mapper/story.mapper';
import StoryResponse from './dto/story-response.dto';
import { CreateStoryBody } from './dto/create-story.dto';
import { CreateCommentBody } from './dto/create-comment.dto';
import { CommentResponse } from './dto/comment-response.dto';

@ApiTags('Story')
@Controller({ path: '/api/v1/story' })
export class StoryController {
  constructor(
    private readonly service: StoryService,
    private readonly mapper: StoryMapper,
  ) {}

  @Get('/all')
  @ApiOperation({ summary: 'Get all stories' })
  @ApiResponse({ type: [StoryResponse] })
  async getAllStories() {
    const stories = await this.service.findAll();
    return stories.map((model) => this.mapper.toResponse(model));
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get story by id' })
  @ApiResponse({ type: StoryResponse })
  async getStoryById(@Param('storyId') id: string) {
    const story = await this.service.findOne(id);
    if (!story) {
      throw new NotFoundException(`Story with id ${id} not found`);
    }
    return this.mapper.toResponse(story);
  }

  @Post('/create')
  @ApiOperation({ summary: 'Create a new story' })
  async createStory(@Body() body: CreateStoryBody) {
    const id = await this.service.create({ ...body });
    return id;
  }

  @Delete('/delete/:id')
  @ApiOperation({ summary: 'Delete a story by id' })
  async deleteStory(@Param('storyId') id: string) {
    const deleted = await this.service.remove(id);
    if (!deleted) {
      throw new NotFoundException(`Story with id ${id} not found`);
    }
    return { message: `Story with id ${id} deleted successfully` };
  }

  @Post(':id/comment/create')
  @ApiOperation({ summary: 'Comment story' })
  async addComment(@Body() commentData: CreateCommentBody) {
    const id = await this.service.addComment(commentData);
    return id;
  }

  @Get(':id/comments/all')
  @ApiResponse({ type: [CommentResponse] })
  @ApiOperation({ summary: 'Get all comments for a story' })
  async getComments(
    @Param('storyId') storyId: string,
  ): Promise<CommentResponse[]> {
    return this.service.findAllComments(storyId);
  }

  @Delete('/comment/delete/:id')
  @ApiOperation({ summary: 'Delete a comment by comment id' })
  async deleteComment(@Param('id') commentId: string) {
    const deleted = await this.service.removeComment(commentId);
    if (!deleted) {
      throw new NotFoundException(`Comment with id ${commentId} not found`);
    }
    return { message: `Comment with id ${commentId} deleted successfully` };
  }
}

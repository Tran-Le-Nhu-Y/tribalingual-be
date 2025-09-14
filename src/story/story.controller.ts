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
import { CreateFavoriteBody } from './dto/create-favorite.dto';

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

  // Comment methods
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

  // Favorite methods
  @Post(':id/favorite/add')
  @ApiOperation({ summary: 'Add story to favorites' })
  async addFavorite(@Body() favoriteData: CreateFavoriteBody) {
    const success = await this.service.addFavorite(favoriteData);
    if (!success) {
      throw new NotFoundException(
        `Could not add story ${favoriteData.storyId} to favorites`,
      );
    }
    return {
      message: `Story with id ${favoriteData.storyId} added to favorites successfully by user with id ${favoriteData.userId}`,
    };
  }

  @Delete(':storyId/favorite/delete/:userId')
  @ApiOperation({ summary: 'Delete a favorite by story id and user id' })
  async deleteFavorite(
    @Param('storyId') storyId: string,
    @Param('userId') userId: string,
  ) {
    const deleted = await this.service.removeFavorite(storyId, userId);
    if (!deleted) {
      throw new NotFoundException(
        `Favorite with story id ${storyId} and user id ${storyId} not found`,
      );
    }
    return {
      message: `Favorite with story id ${storyId} and user id ${storyId} deleted successfully`,
    };
  }
}

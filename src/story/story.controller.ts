import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { StoryService } from './story.service';
import { StoryMapper } from './mapper/story.mapper';
import StoryResponse from './dto/story-response.dto';
import { CreateStoryBody } from './dto/create-story.dto';
import { CreateCommentBody } from './dto/create-comment.dto';
import { CommentResponse } from './dto/comment-response.dto';
import { CreateFavoriteBody } from './dto/create-favorite.dto';
import { CreateViewBody } from './dto/create-view.dto';
import { UpdateStoryBody } from './dto/update-story.dto';
import { PagingWrapper } from './dto/paging-wrapper.dto';
import { StoryStatus } from './entity/story.entity';
import { Permission } from 'src/auth/enum/permission.enum';
import { Permissions } from 'src/auth/permission.decorator';

@ApiTags('Story')
@Controller({ path: '/api/v1/story' })
export class StoryController {
  constructor(
    private readonly service: StoryService,
    private readonly mapper: StoryMapper,
  ) {}

  //   @Get('/all')
  //   @ApiOperation({ summary: 'Get all stories' })
  //   @ApiResponse({ type: PagingWrapper })
  //   @ApiQuery({ name: 'offset', type: Number, required: false, example: 0 })
  //   @ApiQuery({ name: 'limit', type: Number, required: false, example: 20 })
  //   async getAllStories(
  //     @Query('offset') offset = 0,
  //     @Query('limit') limit = 20,
  //   ): Promise<PagingWrapper<StoryResponse>> {
  //     const [entities, total] = await this.service.findAllWithPaging(
  //       offset,
  //       limit,
  //     );
  //     const content = entities.map((model) => this.mapper.toResponse(model));
  //     return {
  //       content,
  //       page_number: Math.floor(offset / limit),
  //       page_size: limit,
  //       total_elements: total,
  //       total_pages: Math.ceil(total / limit),
  //     };
  //   }

  @Permissions(Permission.READ_STORY)
  @Get('/all')
  @ApiOperation({ summary: 'Get all stories (optionally filtered by status)' })
  @ApiResponse({ type: PagingWrapper })
  @ApiQuery({ name: 'offset', type: Number, required: false, example: 0 })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 20 })
  @ApiQuery({
    name: 'status',
    enum: StoryStatus,
    required: false,
    example: StoryStatus.PENDING,
  })
  async getAllStories(
    @Query('offset') offset = 0,
    @Query('limit') limit = 20,
    @Query('status') status?: StoryStatus,
  ): Promise<PagingWrapper<StoryResponse>> {
    const [entities, total] = status
      ? await this.service.findAllByStatusWithPaging(offset, limit, status)
      : await this.service.findAllWithPaging(offset, limit);
    const content = entities.map((entity) => this.mapper.toResponse(entity));
    return {
      content,
      page_number: Math.floor(offset / limit),
      page_size: limit,
      total_elements: total,
      total_pages: Math.ceil(total / limit),
    };
  }

  @Permissions(Permission.READ_STORY)
  @Get('/:id')
  @ApiOperation({ summary: 'Get story by id' })
  @ApiResponse({ type: StoryResponse })
  async getStoryById(@Param('id') id: string) {
    const story = await this.service.findOne(id);
    if (!story) {
      throw new NotFoundException(`Story with id ${id} not found`);
    }
    return this.mapper.toResponse(story);
  }

  @Permissions(Permission.CREATE_STORY)
  @Post('/create')
  @ApiOperation({ summary: 'Create a new story' })
  async createStory(@Body() body: CreateStoryBody) {
    const id = await this.service.create({ ...body });
    return id;
  }

  @Permissions(Permission.UPDATE_STORY)
  @Put('/:id/update')
  @ApiOperation({ summary: 'Update a story' })
  async updateStory(
    @Body() body: UpdateStoryBody,
    @Param('id') storyId: string,
  ) {
    const updatedStory = await this.service.update(storyId, body);
    if (!updatedStory) {
      throw new NotFoundException(`Story with id ${storyId} not found`);
    }
    return updatedStory;
  }

  @Permissions(Permission.PUBLISH_STORY)
  @Put('/:id/publish')
  @ApiOperation({ summary: 'Publish a story (admin only)' })
  @ApiResponse({ type: StoryResponse })
  async publishStory(
    @Param('id') storyId: string,
    @Query('adminId') adminId: string,
  ) {
    const story = await this.service.publish(storyId, adminId);
    if (!story) {
      throw new NotFoundException(`Story with id ${storyId} not found`);
    }
    return this.mapper.toResponse(story);
  }

  @Permissions(Permission.DELETE_STORY)
  @Delete('/:id/delete')
  @ApiOperation({ summary: 'Delete a story by id' })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'Story with id ${id} deleted successfully',
      },
    },
  })
  async deleteStory(
    @Param('id') storyId: string,
    @Query('userId') userId: string,
  ) {
    const deleted = await this.service.remove(storyId, userId);
    if (!deleted) {
      throw new NotFoundException(`Story with id ${storyId} not found`);
    }
    return { message: `Story with id ${storyId} deleted successfully` };
  }

  // Comment methods
  @Permissions(Permission.CREATE_COMMENT)
  @Post(':id/comment/create')
  @ApiOperation({ summary: 'Comment story' })
  async addComment(@Body() commentData: CreateCommentBody) {
    const id = await this.service.addComment(commentData);
    return id;
  }

  @Permissions(Permission.READ_COMMENT)
  @Get(':id/comments/all')
  @ApiResponse({ type: [CommentResponse] })
  @ApiOperation({ summary: 'Get all comments for a story' })
  async getComments(@Param('id') storyId: string): Promise<CommentResponse[]> {
    return this.service.findAllComments(storyId);
  }

  @Permissions(Permission.DELETE_COMMENT)
  @Delete('/comment/:id/delete')
  @ApiOperation({ summary: 'Delete a comment by comment id' })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'Comment with id ${id} deleted successfully',
      },
    },
  })
  async deleteComment(@Param('id') commentId: string) {
    const deleted = await this.service.removeComment(commentId);
    if (!deleted) {
      throw new NotFoundException(`Comment with id ${commentId} not found`);
    }
    return { message: `Comment with id ${commentId} deleted successfully` };
  }

  // Favorite methods
  @Permissions(Permission.CREATE_FAVORITE)
  @Post(':id/favorite/add')
  @ApiOperation({ summary: 'Add favorite for story' })
  @ApiOkResponse({
    schema: {
      example: {
        message:
          'Story with id ${storyId} added to favorite successfully by user with id ${userId}',
      },
    },
  })
  async addFavorite(@Body() favoriteData: CreateFavoriteBody) {
    const success = await this.service.addFavorite(favoriteData);
    if (!success) {
      throw new NotFoundException(
        `Could not add story ${favoriteData.storyId} to favorites`,
      );
    }
    return {
      message: `Story with id ${favoriteData.storyId} added to favorite successfully by user with id ${favoriteData.userId}`,
    };
  }

  @Permissions(Permission.DELETE_FAVORITE)
  @Delete(':storyId/favorite/delete/:userId')
  @ApiOperation({ summary: 'Delete a favorite by story id and user id' })
  @ApiOkResponse({
    schema: {
      example: {
        message:
          'Favorite of story id ${storyId} and user id ${storyId} deleted successfully',
      },
    },
  })
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
      message: `Favorite of story id ${storyId} and user id ${storyId} deleted successfully`,
    };
  }

  // View methods
  @Permissions(Permission.CREATE_VIEW)
  @Post(':id/view/add')
  @ApiOperation({ summary: 'Add view for story' })
  @ApiOkResponse({
    schema: {
      example: {
        message:
          'Story with id ${storyId} added to view successfully by user with id ${userId}',
      },
    },
  })
  async addView(@Body() viewData: CreateViewBody) {
    const success = await this.service.addView(viewData);
    if (!success) {
      throw new NotFoundException(
        `Could not add story ${viewData.storyId} to favorites`,
      );
    }
    return {
      message: `Story with id ${viewData.storyId} added to view successfully by user with id ${viewData.userId}`,
    };
  }
}

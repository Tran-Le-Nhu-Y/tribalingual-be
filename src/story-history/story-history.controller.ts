import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { StoryHistoryService } from './story-history.service';
import { StoryHistoryMapper } from './story-content.mapper';
import StoryHistoryResponse from './dto/story-history-response.dto';
import { CreateStoryHistoryBody } from './dto/create-story-history.dto';
import { Permission } from 'src/auth/enum/permission.enum';
import { Permissions } from 'src/auth/permission.decorator';

@ApiTags('Story History')
@ApiBearerAuth('access-token')
@Controller({ path: '/api/v1/story-history' })
export class StoryHistoryController {
  constructor(
    private readonly service: StoryHistoryService,
    private readonly mapper: StoryHistoryMapper,
  ) {}

  @Permissions(Permission.READ_STORY_HISTORY)
  @Get('/all')
  @ApiOperation({ summary: 'Get all histories' })
  @ApiResponse({ type: [StoryHistoryResponse] })
  async getAllHistories() {
    const histories = await this.service.findAll();
    return this.mapper.toResponseList(histories);
  }

  @Permissions(Permission.READ_STORY_HISTORY)
  @Get('/:id')
  @ApiOperation({ summary: 'Get story history by id' })
  @ApiResponse({ type: StoryHistoryResponse })
  async getHistoryById(@Param('id') id: string) {
    const history = await this.service.findOne(id);
    if (!history) {
      throw new NotFoundException(`Story history  with id ${id} not found`);
    }
    return this.mapper.toResponse(history);
  }

  @Permissions(Permission.CREATE_STORY_HISTORY)
  @Post('/create')
  @ApiOperation({ summary: 'Create a new story history record' })
  async createHistory(@Body() body: CreateStoryHistoryBody) {
    const id = await this.service.create({ ...body });
    return id;
  }

  @Permissions(Permission.DELETE_STORY_HISTORY)
  @Delete('/:id/delete')
  @ApiOkResponse({
    schema: {
      example: {
        message: 'Story history with id ${id} deleted successfully',
      },
    },
  })
  @ApiOperation({ summary: 'Delete a story history by id' })
  async deleteHistory(@Param('id') id: string) {
    const deleted = await this.service.remove(id);
    if (!deleted) {
      throw new NotFoundException(`Story with history id ${id} not found`);
    }
    return { message: `Story history with id ${id} deleted successfully` };
  }
}

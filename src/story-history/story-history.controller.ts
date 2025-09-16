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
import { StoryHistoryService } from './story-history.service';
import { StoryHistoryMapper } from './story-content.mapper';
import StoryHistoryResponse from './dto/story-history-response.dto';
import { CreateStoryHistoryBody } from './dto/create-story-history.dto';

@ApiTags('Story History')
@Controller({ path: '/api/v1/story-history' })
export class StoryHistoryController {
  constructor(
    private readonly service: StoryHistoryService,
    private readonly mapper: StoryHistoryMapper,
  ) {}

  @Get('/all')
  @ApiOperation({ summary: 'Get all histories' })
  @ApiResponse({ type: [StoryHistoryResponse] })
  async getAllHistories() {
    const histories = await this.service.findAll();
    return this.mapper.toResponseList(histories);
  }

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

  @Post('/create')
  @ApiOperation({ summary: 'Create a new story history record' })
  async createHistory(@Body() body: CreateStoryHistoryBody) {
    const id = await this.service.create({ ...body });
    return id;
  }

  @Delete('/delete/:id')
  @ApiOperation({ summary: 'Delete a story history by id' })
  async deleteHistory(@Param('id') id: string) {
    const deleted = await this.service.remove(id);
    if (!deleted) {
      throw new NotFoundException(`Story with history id ${id} not found`);
    }
    return { message: `Story history with id ${id} deleted successfully` };
  }
}

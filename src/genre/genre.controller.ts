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
import { GenreService } from './genre.service';
import { GenreMapper } from './genre.mapper';
import CreateGenreBody from './dto/create-genre.dto';
import UpdateGenreBody from './dto/update-genre.dto';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import GenreResponse from './dto/genre-response.dto';
import { PagingWrapper } from './dto/paging-wrapper.dto';

@Controller({ path: '/api/v1/genre' })
export class GenreController {
  constructor(
    private readonly service: GenreService,
    private readonly mapper: GenreMapper,
  ) {}

  @Get('/all')
  @ApiOperation({ summary: 'Get all genres' })
  @ApiResponse({ type: PagingWrapper })
  @ApiQuery({ name: 'offset', type: Number, required: false, example: 0 })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 20 })
  async getAllGenres(
    @Query('offset') offset = 0,
    @Query('limit') limit = 20,
  ): Promise<PagingWrapper<GenreResponse>> {
    const [entities, total] = await this.service.findAllWithPaging(
      offset,
      limit,
    );
    const content = entities.map((model) => this.mapper.toResponse(model));
    return {
      content,
      page_number: Math.floor(offset / limit),
      page_size: limit,
      total_elements: total,
      total_pages: Math.ceil(total / limit),
    };
  }

  @Get('/genre/:id')
  @ApiOperation({ summary: 'Get genre by id' })
  async getGenreById(@Param('id') id: string) {
    const genre = await this.service.findOne(id);
    if (!genre) {
      throw new NotFoundException(`Genre with id ${id} not found`);
    }
    return this.mapper.toResponse(genre);
  }

  @Post('/create')
  @ApiOperation({ summary: 'Create a new genre' })
  async createGenre(@Body() body: CreateGenreBody) {
    const id = await this.service.create({ ...body });
    return id;
  }

  @Put('/:id/update')
  @ApiOperation({ summary: 'Update a genre' })
  async updateGenre(@Param('id') id: string, @Body() body: UpdateGenreBody) {
    const updatedGenre = await this.service.update(id, body);
    if (!updatedGenre) {
      throw new NotFoundException(`Genre with id ${id} not found`);
    }
    return this.mapper.toResponse(updatedGenre);
  }

  @Delete('/:id/delete')
  @ApiOperation({ summary: 'Delete a genre by id' })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'Genre with id ${id} deleted successfully',
      },
    },
  })
  async deleteGenre(@Param('id') id: string) {
    const deleted = await this.service.remove(id);
    if (!deleted) {
      throw new NotFoundException(`Genre with id ${id} not found`);
    }
    return { message: `Genre with id ${id} deleted successfully` };
  }
}

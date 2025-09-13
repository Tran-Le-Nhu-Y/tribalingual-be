import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreMapper } from './genre.mapper';
import CreateGenreBody from './dto/create-genre.dto';
import UpdateGenreBody from './dto/update-genre.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import GenreResponse from './dto/genre-response.dto';

@Controller({ path: '/api/v1/genre' })
export class GenreController {
  constructor(
    private readonly service: GenreService,
    private readonly mapper: GenreMapper,
  ) {}

  @Get('/all')
  @ApiOperation({ summary: 'Get all genres' })
  @ApiResponse({ type: [GenreResponse] })
  async getAllGenres() {
    const genres = await this.service.findAll();
    return genres.map((model) => this.mapper.toResponse(model));
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

  @Put('/update/:id')
  @ApiOperation({ summary: 'Update a genre' })
  async updateGenre(@Param('id') id: string, @Body() body: UpdateGenreBody) {
    const updatedGenre = await this.service.update(id, body);
    if (!updatedGenre) {
      throw new NotFoundException(`Genre with id ${id} not found`);
    }
    return this.mapper.toResponse(updatedGenre);
  }

  @Delete('/delete/:id')
  @ApiOperation({ summary: 'Delete a genre by id' })
  async deleteGenre(@Param('id') id: string) {
    const deleted = await this.service.remove(id);
    if (!deleted) {
      throw new NotFoundException(`Genre with id ${id} not found`);
    }
    return { message: `Genre with id ${id} deleted successfully` };
  }
}

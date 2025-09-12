import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreMapper } from './genre.mapper';
import CreateGenreBody from './dto/create-genre.dto';
import UpdateGenreBody from './dto/update-genre.dto';

@Controller({ path: '/api/v1/genre' })
export class GenreController {
  constructor(
    private readonly service: GenreService,
    private readonly mapper: GenreMapper,
  ) {}

  @Get('/all')
  async getAllGenres() {
    const genres = await this.service.findAll();
    return genres.map((model) => this.mapper.toResponse(model));
  }

  @Get('/genre/:id')
  async getGenreById(@Param('id', ParseIntPipe) id: number) {
    const genre = await this.service.findOne(id);
    if (!genre) {
      throw new NotFoundException(`Genre with id ${id} not found`);
    }
    return this.mapper.toResponse(genre);
  }

  @Post('/create')
  async createGenre(@Body() body: CreateGenreBody) {
    const id = await this.service.create({ ...body });
    return id;
  }

  @Put('/update/:id')
  async updateGenre(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateGenreBody,
  ) {
    const updatedGenre = await this.service.update(id, body);
    if (!updatedGenre) {
      throw new NotFoundException(`Genre with id ${id} not found`);
    }
    return this.mapper.toResponse(updatedGenre);
  }

  @Delete('/delete/:id')
  async deleteGenre(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.service.remove(id);
    if (!deleted) {
      throw new NotFoundException(`Genre with id ${id} not found`);
    }
    return { message: `Genre with id ${id} deleted successfully` };
  }
}

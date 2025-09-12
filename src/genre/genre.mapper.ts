import { Injectable } from '@nestjs/common';
import GenreResponse from './dto/genre-response.dto';
import GenreEntity from './entity/genre.entity';
import Genre from './interface/genre.interface';

@Injectable()
export class GenreMapper {
  toModel(entity: GenreEntity) {
    return {
      name: entity.name,
      description: entity.description,
    } as Genre;
  }

  toResponse(model: Genre) {
    return {
      ...model,
    } as GenreResponse;
  }
}

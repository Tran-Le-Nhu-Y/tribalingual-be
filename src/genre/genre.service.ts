import { Repository } from 'typeorm';
import GenreEntity from './entity/genre.entity';
import { GenreMapper } from './genre.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import Genre from './interface/genre.interface';
import CreateGenreBody from './dto/create-genre.dto';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(GenreEntity)
    private genreRepository: Repository<GenreEntity>,
    private readonly mapper: GenreMapper,
  ) {}

  async findAll(): Promise<Genre[]> {
    const entities = await this.genreRepository.find();
    return entities.map((entity) => this.mapper.toModel(entity));
  }

  async findOne(id: string): Promise<Genre | null> {
    const entity = await this.genreRepository.findOneBy({ id });
    return entity !== null ? this.mapper.toModel(entity) : null;
  }

  async create(data: CreateGenreBody): Promise<string> {
    const entity = this.genreRepository.create({
      name: data.name,
      description: data.description,
    });
    const savedEntity = await this.genreRepository.save(entity);
    return savedEntity.id;
  }

  async update(id: string, data: Partial<Genre>): Promise<Genre | null> {
    const entity = await this.genreRepository.findOneBy({ id });
    if (!entity) {
      return null;
    }
    const updatedEntity = this.genreRepository.merge(entity, data);
    const savedEntity = await this.genreRepository.save(updatedEntity);

    return this.mapper.toModel(savedEntity);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.genreRepository.delete(id);
    return result.affected !== 0; // true if a row was deleted, false otherwise
  }
}

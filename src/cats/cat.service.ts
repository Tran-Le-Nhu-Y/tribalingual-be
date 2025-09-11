import { Injectable } from '@nestjs/common';
import type Cat from './interface/cat.interface';
import { Repository } from 'typeorm';
import CatEntity from './entity/cat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CatMapper } from './cat.mapper';

@Injectable()
export class CatService {
  constructor(
    @InjectRepository(CatEntity)
    private catRepository: Repository<CatEntity>,
    private readonly mapper: CatMapper,
  ) {}

  async findAll(): Promise<Cat[]> {
    const entities = await this.catRepository.find();
    return entities.map((entity) => this.mapper.toModel(entity));
  }

  async findOne(id: number): Promise<Cat | null> {
    const entity = await this.catRepository.findOneBy({ id });
    return entity !== null ? this.mapper.toModel(entity) : null;
  }

  async create(data: Cat) {
    const entity = { ...data } as CatEntity;
    const savedEntity = await this.catRepository.save(entity);
    return savedEntity.id;
  }

  async remove(id: number): Promise<void> {
    await this.catRepository.delete(id);
  }
}

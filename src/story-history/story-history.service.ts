import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { StoryHistoryEntity } from './entity/story-history.entity';
import { StoryHistoryMapper } from './story-content.mapper';
import { CreateStoryHistoryBody } from './dto/create-story-history.dto';
import StoryEntity from 'src/story/entity/story.entity';
import { UserEntity } from 'src/user/entity/user.entity';

@Injectable()
export class StoryHistoryService {
  constructor(
    @InjectRepository(StoryHistoryEntity)
    private storyHistoryRepository: Repository<StoryHistoryEntity>,
    private readonly mapper: StoryHistoryMapper,

    @InjectRepository(StoryEntity)
    private storyRepository: Repository<StoryEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<StoryHistoryEntity[]> {
    return this.storyHistoryRepository.find({
      relations: ['story', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<StoryHistoryEntity | null> {
    const entity = await this.storyHistoryRepository.findOne({
      where: { id },
      relations: ['story', 'user'],
    });
    if (!entity) {
      throw new NotFoundException(`Story history  with id ${id} not found`);
    }
    return entity;
  }

  async create(data: CreateStoryHistoryBody): Promise<string> {
    const story = await this.storyRepository.findOneBy({
      id: data.storyId,
    });
    if (!story) {
      throw new NotFoundException(`Story with id ${data.storyId} not found`);
    }

    const user = await this.userRepository.findOneBy({
      id: data.userId,
    });
    if (!user) {
      throw new NotFoundException(`User with id ${data.userId} not found`);
    }

    const history = this.storyHistoryRepository.create({
      story: story,
      user: user,
      action: data.action,
      createdAt: data.createdAt ?? new Date(),
    });
    const savedHistory = await this.storyHistoryRepository.save(history);

    return savedHistory.id;
  }

  //   async update(id: string, data: Partial<Genre>): Promise<Genre | null> {
  //     const entity = await this.storyHistoryRepository.findOneBy({ id });
  //     if (!entity) {
  //       throw new NotFoundException(`Genre with id ${id} not found`);
  //     }
  //     const updatedEntity = this.storyHistoryRepository.merge(entity, data);
  //     const savedEntity = await this.storyHistoryRepository.save(updatedEntity);

  //     return this.mapper.toModel(savedEntity);
  //   }

  //   async remove(id: string): Promise<boolean> {
  //     const result = await this.storyHistoryRepository.delete(id);
  //     return result.affected !== 0; // true if a row was deleted, false otherwise
  //   }
}

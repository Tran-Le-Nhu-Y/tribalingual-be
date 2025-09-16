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
      storyTitle: story.title,
      storyAuthorId: story.authorId,
      storyPublishedDate: story.publishedDate,
    });
    const savedHistory = await this.storyHistoryRepository.save(history);

    return savedHistory.id;
  }

  async remove(id: string): Promise<boolean> {
    const history = await this.storyHistoryRepository.findOneBy({
      id,
    });
    if (!history) {
      throw new NotFoundException(`Story history with id ${id} not found`);
    }
    const result = await this.storyHistoryRepository.delete(id);
    return result.affected !== 0; // true if a row was deleted, false otherwise
  }
}

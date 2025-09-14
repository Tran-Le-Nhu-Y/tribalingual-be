import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { StoryMapper } from './mapper/story.mapper';
import Story from './interface/story.interface';
import StoryEntity from './entity/story.entity';
import { CommentEntity } from './entity/comment.entity';
import { CreateCommentBody } from './dto/create-comment.dto';
import { UserEntity } from 'src/user/entity/user.entity';
import Comment from './interface/comment.interface';
import { CommentMapper } from './mapper/comment.mapper';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(StoryEntity)
    private storyRepository: Repository<StoryEntity>,
    private readonly storyMapper: StoryMapper,

    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    private readonly commentMapper: CommentMapper,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<Story[]> {
    const entities = await this.storyRepository.find();
    return entities.map((entity) => this.storyMapper.toModel(entity));
  }

  async findOne(id: string): Promise<Story | null> {
    const entity = await this.storyRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`Story with id ${id} not found`);
    }
    return entity !== null ? this.storyMapper.toModel(entity) : null;
  }

  async create(data: Partial<Story>): Promise<string> {
    const entity = this.storyRepository.create(data);
    const savedEntity = await this.storyRepository.save(entity);
    return savedEntity.id;
  }

  async update(id: string, data: Partial<Story>): Promise<Story | null> {
    const entity = await this.storyRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`Story with id ${id} not found`);
    }
    const updatedEntity = this.storyRepository.merge(entity, data);
    const savedEntity = await this.storyRepository.save(updatedEntity);

    return this.storyMapper.toModel(savedEntity);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.storyRepository.delete(id);
    return result.affected !== 0; // true if a row was deleted, false otherwise
  }

  async addComment(commentData: CreateCommentBody): Promise<string> {
    const story = await this.storyRepository.findOneBy({
      id: commentData.storyId,
    });
    if (!story) {
      throw new NotFoundException(
        `Story with id ${commentData.storyId} not found`,
      );
    }
    const user = await this.userRepository.findOneBy({
      id: commentData.authorId,
    });
    if (!user) {
      throw new NotFoundException(
        `User with id ${commentData.authorId} not found`,
      );
    }
    const comment = this.commentRepository.create({
      story: story,
      user: user,
      content: commentData.content,
      createdAt: commentData.createdAt || new Date(),
    });
    const savedComment = await this.commentRepository.save(comment);

    // Update comment count
    story.commentCount = story.commentCount + 1;
    await this.storyRepository.save(story);

    return savedComment.id;
  }

  async findAllComments(storyId: string): Promise<CommentEntity[]> {
    const story = await this.storyRepository.findOneBy({ id: storyId });
    if (!story) {
      throw new NotFoundException(`Story with id ${storyId} not found`);
    }
    return this.commentRepository.find({
      where: { story: { id: storyId } },
      relations: ['user', 'story'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateComment(
    commentId: string,
    data: Partial<Comment>,
  ): Promise<Comment | null> {
    const comment = await this.commentRepository.findOneBy({ id: commentId });
    if (!comment) {
      throw new NotFoundException(`Genre with id ${commentId} not found`);
    }
    const updatedComment = this.commentRepository.merge(comment, data);
    const savedComment = await this.commentRepository.save(updatedComment);

    return this.commentMapper.toModel(savedComment);
  }

  async removeComment(commentId: string): Promise<boolean> {
    if (!commentId) return false;
    const result = await this.commentRepository.delete(commentId);
    return result.affected !== 0; // true if a row was deleted, false otherwise
  }
}

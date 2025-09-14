import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StoryMapper } from './mapper/story.mapper';
import Story from './interface/story.interface';
import StoryEntity from './entity/story.entity';
import { CommentEntity } from './entity/comment.entity';
import { CreateCommentBody } from './dto/create-comment.dto';
import { UserEntity } from 'src/user/entity/user.entity';
import Comment from './interface/comment.interface';
import { CommentMapper } from './mapper/comment.mapper';
import { CreateFavoriteBody } from './dto/create-favorite.dto';
import { FavoriteEntity } from './entity/favorite.entity';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(StoryEntity)
    private storyRepository: Repository<StoryEntity>,
    private readonly storyMapper: StoryMapper,

    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    private readonly commentMapper: CommentMapper,

    @InjectRepository(FavoriteEntity)
    private readonly favoriteRepository: Repository<FavoriteEntity>,

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

  //Comment methods
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
      id: commentData.userId,
    });
    if (!user) {
      throw new NotFoundException(
        `User with id ${commentData.userId} not found`,
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
    story.commentCount = (story.commentCount || 0) + 1;
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

    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['story'],
    });
    if (!comment) {
      throw new NotFoundException(`Comment with id ${commentId} not found`);
    }

    const result = await this.commentRepository.delete(commentId);

    if (result.affected && result.affected > 0) {
      // Update commentCount
      const story = comment.story;
      story.commentCount = Math.max((story.commentCount || 1) - 1, 0);
      await this.storyRepository.save(story);

      return true;
    }
    return false; // true if a row was deleted, false otherwise
  }

  //Favorite methods
  async addFavorite(favoriteData: CreateFavoriteBody): Promise<boolean> {
    const story = await this.storyRepository.findOneBy({
      id: favoriteData.storyId,
    });
    if (!story) {
      throw new NotFoundException(
        `Story with id ${favoriteData.storyId} not found`,
      );
    }
    const user = await this.userRepository.findOneBy({
      id: favoriteData.userId,
    });
    if (!user) {
      throw new NotFoundException(
        `User with id ${favoriteData.userId} not found`,
      );
    }

    const existingFavorite = await this.favoriteRepository.findOne({
      where: {
        story: { id: favoriteData.storyId },
        user: { id: favoriteData.userId },
      },
      relations: ['story', 'user'],
    });

    if (existingFavorite) {
      throw new ConflictException('Already favorited');
    }

    const favorite = this.favoriteRepository.create({
      story: story,
      user: user,
      addedDate: favoriteData.addedDate || new Date(),
    });
    const savedFavorite = await this.favoriteRepository.save(favorite);

    // Update favorite count
    story.favoriteCount = (story.favoriteCount || 0) + 1;
    await this.storyRepository.save(story);

    return savedFavorite ? true : false;
  }

  async removeFavorite(storyId: string, userId: string): Promise<boolean> {
    if (!storyId && !userId) return false;

    const favorite = await this.favoriteRepository.findOne({
      where: { storyId: storyId, userId: userId },
      relations: ['story'],
    });
    if (!favorite) {
      throw new NotFoundException(
        `Favorite with story id ${storyId} and user id ${storyId} not found`,
      );
    }

    const result = await this.favoriteRepository.delete({ storyId, userId });

    if (result.affected && result.affected > 0) {
      // Update commentCount
      const story = favorite.story;
      story.favoriteCount = Math.max((story.favoriteCount || 1) - 1, 0);
      await this.storyRepository.save(story);

      return true;
    }
    return false; // true if a row was deleted, false otherwise
  }
}

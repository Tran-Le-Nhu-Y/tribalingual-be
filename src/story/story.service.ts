import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StoryMapper } from './mapper/story.mapper';
import Story from './interface/story.interface';
import StoryEntity, { StoryStatus } from './entity/story.entity';
import { CommentEntity } from './entity/comment.entity';
import { CreateCommentBody } from './dto/create-comment.dto';
import { UserEntity } from 'src/user/entity/user.entity';
import Comment from './interface/comment.interface';
import { CommentMapper } from './mapper/comment.mapper';
import { CreateFavoriteBody } from './dto/create-favorite.dto';
import { FavoriteEntity } from './entity/favorite.entity';
import { CreateViewBody } from './dto/create-view.dto';
import { ViewEntity } from './entity/view.entity';
import { UpdateStoryBody } from './dto/update-story.dto';
import {
  StoryAction,
  StoryHistoryEntity,
} from 'src/story-history/entity/story-history.entity';
import { CreateStoryBody } from './dto/create-story.dto';
import GenreEntity from 'src/genre/entity/genre.entity';
import FileEntity from 'src/file/entity/file.entity';
import StoryResponse from './dto/story-response.dto';
import { v2 as cloudinary } from 'cloudinary';

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

    @InjectRepository(ViewEntity)
    private readonly viewRepository: Repository<ViewEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(StoryHistoryEntity)
    private readonly storyHistoryRepository: Repository<StoryHistoryEntity>,

    @InjectRepository(GenreEntity)
    private readonly genreRepository: Repository<GenreEntity>,

    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async findAllWithPaging(
    offset: number,
    limit: number,
  ): Promise<[Story[], number]> {
    return this.storyRepository.findAndCount({
      skip: offset,
      take: limit,
      order: { publishedDate: 'DESC' },
    });
  }

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

  async create(data: CreateStoryBody): Promise<string> {
    const author = await this.userRepository.findOneBy({
      id: data.authorId,
    });
    if (!author) {
      throw new NotFoundException(`Author with id ${data.authorId} not found`);
    }

    const genre = await this.genreRepository.findOneBy({
      id: data.genreId,
    });
    if (!genre) {
      throw new NotFoundException(`Genre with id ${data.genreId} not found`);
    }

    const story = this.storyRepository.create({
      ...data,
      uploadedDate: new Date(),
      lastUpdatedDate: new Date(),
    });
    const savedStory = await this.storyRepository.save(story);

    if (data.fileId) {
      const file = await this.fileRepository.findOne({
        where: { id: data.fileId },
      });
      if (file) {
        file.story = savedStory;
        await this.fileRepository.save(file);
      }
    }

    //Create history record: CREATED
    const history = this.storyHistoryRepository.create({
      storyId: savedStory.id,
      userId: savedStory.authorId,
      action: StoryAction.CREATED,
      storyTitle: savedStory.title,
      storyAuthorId: savedStory.authorId,
      storyPublishedDate: savedStory.publishedDate,
      createdAt: new Date(),
    });
    await this.storyHistoryRepository.save(history);

    return savedStory.id;
  }

  async update(storyId: string, data: UpdateStoryBody): Promise<StoryResponse> {
    const story = await this.storyRepository.findOne({
      where: { id: storyId },
      relations: ['file'],
    });
    if (!story) {
      throw new NotFoundException(`Story with id ${storyId} not found`);
    }

    const user = await this.userRepository.findOneBy({ id: data.userId });
    if (!user) {
      throw new NotFoundException(`User with id ${data.userId} not found`);
    }

    // If story was published, only admin can update story
    if (story.status === StoryStatus.PUBLISHED) {
      if (!story.adminId || story.adminId !== data.userId) {
        throw new ForbiddenException(
          'You are not allowed to update a published story',
        );
      }
    } else {
      // If story was not published, author and admin can update story
      if (story.authorId !== data.userId && story.adminId !== data.userId) {
        throw new ForbiddenException(
          'Only the author or an admin can update this story before publish',
        );
      }
    }
    if (data.fileId) {
      const newFile = await this.fileRepository.findOne({
        where: { id: data.fileId },
      });
      if (newFile) {
        // delete old file
        if (story.file) {
          await this.fileRepository.remove(story.file);
          await cloudinary.uploader.destroy(story.file.save_path);
        }

        newFile.story = story;
        await this.fileRepository.save(newFile);
        story.file = newFile;
      }
    }

    Object.assign(story, data);
    story.lastUpdatedDate = new Date();

    const updatedStory = await this.storyRepository.save(story);

    //Create history record: UPDATED
    const history = this.storyHistoryRepository.create({
      storyId: storyId,
      userId: data.userId,
      action: StoryAction.UPDATED,
      storyTitle: updatedStory.title,
      storyAuthorId: updatedStory.authorId,
      storyPublishedDate: updatedStory.publishedDate,
      createdAt: new Date(),
    });
    await this.storyHistoryRepository.save(history);

    return this.storyMapper.toResponse(this.storyMapper.toModel(updatedStory));
  }

  async publish(storyId: string, adminId: string): Promise<StoryEntity> {
    const story = await this.storyRepository.findOne({
      where: { id: storyId },
    });
    if (!story) {
      throw new NotFoundException(`Story with id ${storyId} not found`);
    }

    const admin = await this.userRepository.findOneBy({ id: adminId });
    if (!admin) {
      throw new NotFoundException(`Admin with id ${adminId} not found`);
    }

    story.adminId = adminId;
    story.status = StoryStatus.PUBLISHED;
    story.publishedDate = new Date();
    story.lastUpdatedDate = new Date();

    //Create history record: PUBLISHED
    const history = this.storyHistoryRepository.create({
      storyId: storyId,
      userId: adminId,
      action: StoryAction.PUBLISHED,
      storyTitle: story.title,
      storyAuthorId: story.authorId,
      storyPublishedDate: story.publishedDate,
      createdAt: new Date(),
    });
    await this.storyHistoryRepository.save(history);

    return await this.storyRepository.save(story);
  }

  async remove(storyId: string, userId: string): Promise<boolean> {
    const story = await this.storyRepository.findOne({
      where: { id: storyId },
      relations: ['file'],
    });
    if (!story) {
      throw new NotFoundException(`Story with id ${storyId} not found`);
    }

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    //Create history record: DELETED
    const history = this.storyHistoryRepository.create({
      storyId: storyId,
      userId: userId,
      action: StoryAction.DELETED,
      storyTitle: story.title,
      storyAuthorId: story.authorId,
      storyPublishedDate: story.publishedDate,
      createdAt: new Date(),
    });
    await this.storyHistoryRepository.save(history);

    try {
      // Delete file in cloud
      if (story.file?.save_path) {
        await cloudinary.uploader.destroy(story.file.save_path);
      }
      // Delete file record in DB
      if (story.file) {
        await this.fileRepository.remove(story.file);
      }

      //Delete story in DB
      await this.storyRepository.remove(story);
      return true;
    } catch (error) {
      console.error('Error removing story and file:', error);
      throw new Error('Cannot remove story');
    }
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

  //View methods
  async addView(viewData: CreateViewBody): Promise<boolean> {
    const story = await this.storyRepository.findOneBy({
      id: viewData.storyId,
    });
    if (!story) {
      throw new NotFoundException(
        `Story with id ${viewData.storyId} not found`,
      );
    }
    const user = await this.userRepository.findOneBy({
      id: viewData.userId,
    });
    if (!user) {
      throw new NotFoundException(`User with id ${viewData.userId} not found`);
    }

    const existingView = await this.viewRepository.findOne({
      where: {
        story: { id: viewData.storyId },
        user: { id: viewData.userId },
      },
      relations: ['story', 'user'],
    });

    if (existingView) {
      existingView.lastViewDate = viewData.lastViewDate || new Date();
      await this.viewRepository.save(existingView);
    } else {
      const view = this.viewRepository.create({
        story: story,
        user: user,
        lastViewDate: viewData.lastViewDate || new Date(),
      });
      await this.viewRepository.save(view);

      // Update view count
      story.viewCount = (story.viewCount || 0) + 1;
      await this.storyRepository.save(story);
    }

    return true;
  }
}

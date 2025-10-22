import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StoryMapper } from './mapper/story.mapper';
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
import { CommentResponse } from './dto/comment-response.dto';

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
  ): Promise<[StoryEntity[], number]> {
    return this.storyRepository.findAndCount({
      skip: offset,
      take: limit,
      order: { publishedDate: 'DESC' },
    });
  }

  async findAllByStatusWithPaging(
    offset: number,
    limit: number,
    status: StoryStatus,
  ): Promise<[StoryEntity[], number]> {
    return this.storyRepository.findAndCount({
      skip: offset,
      take: limit,
      where: { status: status },
      order: { publishedDate: 'DESC' },
      relations: ['genre', 'file'],
    });
  }

  async findOne(id: string): Promise<StoryEntity | null> {
    const story = await this.storyRepository.findOne({
      where: { id },
      relations: ['genre', 'file', 'comments'],
    });
    if (!story) {
      throw new NotFoundException(`Story with id ${id} not found`);
    }
    return story;
  }

  async findAllByAuthorIdWithPaging(
    offset: number,
    limit: number,
    authorId: string,
  ): Promise<[StoryEntity[], number]> {
    return this.storyRepository.findAndCount({
      skip: offset,
      take: limit,
      where: { authorId: authorId },
      order: { publishedDate: 'DESC' },
      relations: ['genre', 'file'],
    });
  }

  async searchByTitleWithPaging(
    offset: number,
    limit: number,
    title: string,
  ): Promise<[StoryEntity[], number]> {
    if (!title || title.trim() === '') {
      return this.storyRepository.findAndCount({
        skip: offset,
        take: limit,
        order: { publishedDate: 'DESC' },
        relations: ['genre', 'file'],
      });
    }
    return this.storyRepository.findAndCount({
      where: { title: Like(`%${title}%`) },
      skip: offset,
      take: limit,
      order: { publishedDate: 'DESC' },
      relations: ['genre', 'file'],
    });
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
    if (data.fileId && data.fileId !== story.fileId) {
      if (story.file) {
        // Delete old file in cloud and old file record in DB
        try {
          await cloudinary.uploader.destroy(story.file.save_path);
        } catch (e) {
          console.warn('Failed to delete old file on Cloudinary:', e);
        }
        await this.fileRepository.remove(story.file);
      }
      const newFile = await this.fileRepository.findOne({
        where: { id: data.fileId },
      });
      if (!newFile) {
        throw new NotFoundException(`File with id ${data.fileId} not found`);
      }

      newFile.storyId = story.id;
      await this.fileRepository.save(newFile);
      story.file = newFile;
    }

    if (data.genreId && data.genreId !== story.genreId) {
      const newGenre = await this.genreRepository.findOne({
        where: { id: data.genreId },
      });
      if (!newGenre) {
        throw new NotFoundException(`Genre with id ${data.genreId} not found`);
      }
      story.genre = newGenre;
      story.genreId = data.genreId;
    }

    Object.assign(story, {
      genreId: data.genreId,
      title: data.title,
      description: data.description,
      language: data.language,
      viewLink: data.viewLink,
      gameLink: data.gameLink,
      hmongContent: data.hmongContent,
      englishContent: data.englishContent,
      vietnameseContent: data.vietnameseContent,
      status: data.status,
    });
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

    return this.storyMapper.toResponse(updatedStory);
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
      // Delete story
      await this.storyRepository.remove(story);

      // Delete file in cloud and file record in DB
      if (story.file?.save_path) {
        await cloudinary.uploader.destroy(story.file?.save_path);
      }
      await this.fileRepository.remove(story.file!);

      return true;
    } catch (error) {
      console.error('Error removing story and file:', error);
      throw new Error('Cannot remove story');
    }
  }

  //Comment methods
  async addComment(commentData: CreateCommentBody): Promise<string> {
    const isStoryExist = await this.storyRepository.existsBy({
      id: commentData.storyId,
    });
    if (!isStoryExist) {
      throw new NotFoundException(
        `Story with id ${commentData.storyId} not found`,
      );
    }
    const isUserExist = await this.userRepository.existsBy({
      id: commentData.userId,
    });
    if (!isUserExist) {
      throw new NotFoundException(
        `User with id ${commentData.userId} not found`,
      );
    }

    const savedComment = await this.commentRepository.save({
      storyId: commentData.storyId,
      userId: commentData.userId,
      content: commentData.content,
      createdAt: new Date(),
    });

    // Update comment count
    const story = await this.storyRepository.findOneBy({
      id: commentData.storyId,
    });
    story!.commentCount = (story!.commentCount || 0) + 1;
    await this.storyRepository.save(story!);

    return savedComment.id;
  }

  async findAllComments(storyId: string): Promise<CommentResponse[]> {
    const story = await this.storyRepository.findOneBy({ id: storyId });
    if (!story) {
      throw new NotFoundException(`Story with id ${storyId} not found`);
    }
    const comments = await this.commentRepository.find({
      where: { story: { id: storyId } },
      relations: ['story', 'user'], // join story, user
      order: { createdAt: 'DESC' },
    });

    return this.commentMapper.toResponseList(comments);
  }

  async findAllCommentsWithPaging(
    offset: number,
    limit: number,
    storyId: string,
  ): Promise<[CommentEntity[], number]> {
    const story = await this.storyRepository.findOneBy({ id: storyId });
    if (!story) {
      throw new NotFoundException(`Story with id ${storyId} not found`);
    }
    return this.commentRepository.findAndCount({
      skip: offset,
      take: limit,
      where: { story: { id: storyId } },
      order: { createdAt: 'DESC' },
      relations: ['story', 'user'],
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
      // check ko xài thì đổi thành exist
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
      storyId: story.id,
      userId: user.id,
      addedDate: new Date(),
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

  async isFavorited(storyId: string, userId: string): Promise<boolean> {
    const favorite = await this.favoriteRepository.findOne({
      where: { storyId: storyId, userId: userId },
    });
    return favorite ? true : false;
  }

  async findAllFavoritesByUser(userId: string): Promise<StoryEntity[]> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    const favorites = await this.favoriteRepository.find({
      where: { userId },
      relations: ['story', 'story.genre', 'story.file'],
      order: { addedDate: 'DESC' },
    });

    return favorites
      .filter((fav) => fav.story !== null)
      .map((fav) => fav.story);
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
      existingView.lastViewDate = new Date();
      await this.viewRepository.save(existingView);
    } else {
      const view = this.viewRepository.create({
        story: story,
        user: user,
        lastViewDate: new Date(),
      });
      await this.viewRepository.save(view);

      // Update view count
      story.viewCount = (story.viewCount || 0) + 1;
      await this.storyRepository.save(story);
    }

    return true;
  }
}

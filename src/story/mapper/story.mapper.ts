import { Injectable } from '@nestjs/common';
import StoryEntity from '../entity/story.entity';
import Story from '../interface/story.interface';
import StoryResponse from '../dto/story-response.dto';
import { FileMapper } from 'src/file/file.mapper';
import { GenreMapper } from 'src/genre/genre.mapper';
import { CommentMapper } from './comment.mapper';

@Injectable()
export class StoryMapper {
  constructor(
    private readonly fileMapper: FileMapper,
    private readonly genreMapper: GenreMapper,
    private readonly commentMapper: CommentMapper,
  ) {}
  //Entity -> Model
  toModel(entity: StoryEntity): Story {
    return {
      id: entity.id,
      authorId: entity.authorId,
      adminId: entity.adminId,
      genreId: entity.genreId,
      fileId: entity.fileId,
      title: entity.title,
      description: entity.description,
      language: entity.language,
      viewLink: entity.viewLink,
      gameLink: entity.gameLink,
      hmongContent: entity.hmongContent,
      englishContent: entity.englishContent,
      vietnameseContent: entity.vietnameseContent,
      status: entity.status,
      uploadedDate: entity.uploadedDate,
      publishedDate: entity.publishedDate,
      lastUpdatedDate: entity.lastUpdatedDate,
      viewCount: entity.viewCount,
      commentCount: entity.commentCount,
      favoriteCount: entity.favoriteCount,
    };
  }

  //Entity -> DTO
  toResponse(entity: StoryEntity): StoryResponse {
    return {
      id: entity.id,
      authorId: entity.authorId,
      adminId: entity.adminId,
      genreId: entity.genreId,
      fileId: entity.fileId,
      title: entity.title,
      description: entity.description,
      language: entity.language,
      viewLink: entity.viewLink,
      gameLink: entity.gameLink,
      hmongContent: entity.hmongContent ?? null,
      englishContent: entity.englishContent ?? null,
      vietnameseContent: entity.vietnameseContent ?? null,
      status: entity.status,
      uploadedDate: entity.uploadedDate ?? null,
      publishedDate: entity.publishedDate ?? null,
      lastUpdatedDate: entity.lastUpdatedDate ?? null,
      viewCount: entity.viewCount,
      commentCount: entity.commentCount,
      favoriteCount: entity.favoriteCount,
      file: entity.file ? this.fileMapper.toResponse(entity.file) : null,
      genre: entity.genre ? this.genreMapper.toResponse(entity.genre) : null,
      comments: entity.comments
        ? entity.comments.map((c) => this.commentMapper.toResponse(c))
        : [],
    };
  }
}

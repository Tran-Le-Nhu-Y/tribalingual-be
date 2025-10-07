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

// import { Injectable } from '@nestjs/common';
// import StoryEntity from '../entity/story.entity';
// import Story from '../interface/story.interface';
// import StoryResponse from '../dto/story-response.dto';
// import FileResponse from 'src/file/dto/file-response.dto';
// import GenreResponse from 'src/genre/dto/genre-response.dto';
// import { CommentResponse } from '../dto/comment-response.dto';

// @Injectable()
// export class StoryMapper {
//   // Entity -> Model
//   toModel(entity: StoryEntity): Story {
//     return {
//       id: entity.id,
//       authorId: entity.authorId,
//       adminId: entity.adminId,
//       genreId: entity.genreId,
//       fileId: entity.fileId,
//       title: entity.title,
//       description: entity.description,
//       language: entity.language,
//       hmongContent: entity.hmongContent,
//       englishContent: entity.englishContent,
//       vietnameseContent: entity.vietnameseContent,
//       status: entity.status,
//       uploadedDate: entity.uploadedDate,
//       publishedDate: entity.publishedDate,
//       lastUpdatedDate: entity.lastUpdatedDate,
//       viewCount: entity.viewCount,
//       commentCount: entity.commentCount,
//       favoriteCount: entity.favoriteCount,
//     };
//   }

//   // Entity -> DTO
//   toResponse(entity: StoryEntity): StoryResponse {
//     const file: FileResponse | null = entity.file
//       ? {
//           id: entity.file.id,
//           storyId: entity.file.storyId,
//           name: entity.file.name,
//           mime_type: entity.file.mime_type,
//           size: entity.file.size,
//           url: entity.file.url,
//           save_path: entity.file.save_path,
//         }
//       : null;

//     const genre: GenreResponse | null = entity.genre
//       ? {
//           id: entity.genre.id,
//           name: entity.genre.name,
//           description: entity.genre.description,
//         }
//       : null;

//     const comments: CommentResponse[] = entity.comments
//       ? entity.comments.map((comment) => ({
//           id: comment.id,
//           content: comment.content,
//           createdAt: comment.createdAt,
//           storyId: comment.storyId,
//           userId: comment.userId,
//         }))
//       : [];

//     return {
//       id: entity.id,
//       authorId: entity.authorId,
//       adminId: entity.adminId,
//       genreId: entity.genreId,
//       fileId: entity.fileId,
//       title: entity.title,
//       description: entity.description,
//       language: entity.language,
//       hmongContent: entity.hmongContent ?? '',
//       englishContent: entity.englishContent ?? '',
//       vietnameseContent: entity.vietnameseContent ?? '',
//       status: entity.status,
//       uploadedDate: entity.uploadedDate,
//       publishedDate: entity.publishedDate,
//       lastUpdatedDate: entity.lastUpdatedDate,
//       viewCount: entity.viewCount,
//       commentCount: entity.commentCount,
//       favoriteCount: entity.favoriteCount,
//       file,
//       genre,
//       comments,
//     };
//   }
// }

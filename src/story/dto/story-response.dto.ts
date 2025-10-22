import { ApiProperty } from '@nestjs/swagger';
import { Language, StoryStatus } from '../entity/story.entity';
import FileResponse from 'src/file/dto/file-response.dto';
import GenreResponse from 'src/genre/dto/genre-response.dto';
import { CommentResponse } from './comment-response.dto';

export default class StoryResponse {
  @ApiProperty({ description: 'Story id', format: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Author id', format: 'uuid' })
  authorId: string;

  @ApiProperty({ description: 'Admin id', format: 'string', required: false })
  adminId?: string;

  @ApiProperty({ description: 'Genre id', format: 'uuid' })
  genreId: string;

  @ApiProperty({ description: 'File id', format: 'uuid' })
  fileId?: string;

  @ApiProperty({
    description: 'Title of the story',
    minLength: 1,
    maxLength: 255,
  })
  title: string;

  @ApiProperty({
    description: 'Description of the story',
    minLength: 1,
    maxLength: 1000,
  })
  description: string;

  @ApiProperty({ description: 'Language', enum: Language })
  language: Language;

  @ApiProperty({ description: 'Access link to read story' })
  viewLink?: string | null;

  @ApiProperty({ description: 'Access link to play game' })
  gameLink?: string | null;

  @ApiProperty({ description: 'Content in Hmong language' })
  hmongContent?: string | null;

  @ApiProperty({ description: 'Content in English language' })
  englishContent?: string | null;

  @ApiProperty({ description: 'Content in Vietnamese language' })
  vietnameseContent?: string | null;

  @ApiProperty({ description: 'Story status', enum: StoryStatus })
  status: StoryStatus;

  @ApiProperty({ description: 'Date when story was uploaded' })
  uploadedDate?: Date | null;

  @ApiProperty({ description: 'Date story was published', required: false })
  publishedDate?: Date | null;

  @ApiProperty({ description: 'Last time story was updated' })
  lastUpdatedDate?: Date | null;

  @ApiProperty({ description: 'Number of views' })
  viewCount: number;

  @ApiProperty({ description: 'Number of comments' })
  commentCount: number;

  @ApiProperty({ description: 'Number of likes (favorites)' })
  favoriteCount: number;

  @ApiProperty({
    description: 'File info associated with this story',
    required: false,
    type: () => FileResponse,
  })
  file?: FileResponse | null;

  @ApiProperty({
    description: 'Genre info associated with this story',
    required: false,
    type: () => GenreResponse,
  })
  genre?: GenreResponse | null;
  @ApiProperty({
    description: 'List of comments for this story',
    required: false,
    type: () => [CommentResponse],
  })
  comments?: CommentResponse[];
}

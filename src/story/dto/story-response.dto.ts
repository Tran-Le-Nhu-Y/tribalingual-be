import { ApiProperty } from '@nestjs/swagger';
import { Language, StoryStatus } from '../entity/story.entity';

export default class StoryResponse {
  @ApiProperty({ description: 'Story id', format: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Author id', format: 'uuid' })
  authorId: string;

  @ApiProperty({ description: 'Admin id', format: 'uuid' })
  adminId?: string | null;

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
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { StoryStatus, Language } from '../entity/story.entity';

export class UpdateStoryBody {
  @ApiProperty({
    description: 'User ID who performs the update',
    format: 'string',
  })
  userId: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ description: 'Genre ID', format: 'uuid' })
  genreId?: string;

  @ApiProperty({
    description: 'File ID associated with the story',
    required: false,
    format: 'uuid',
  })
  @IsUUID()
  @IsOptional()
  fileId?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Story title' })
  title?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Short description of the story' })
  description?: string;

  @IsOptional()
  @IsEnum(Language)
  @ApiPropertyOptional({ description: 'Language of the story', enum: Language })
  language?: Language;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Access link to read story' })
  viewLink?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Access link to play game' })
  gameLink?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Content in Hmong' })
  hmongContent?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Content in English' })
  englishContent?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Content in Vietnamese' })
  vietnameseContent?: string;

  @IsOptional()
  @IsEnum(StoryStatus)
  @ApiPropertyOptional({ description: 'Story status', enum: StoryStatus })
  status?: StoryStatus;
}

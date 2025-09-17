import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { StoryStatus, Language } from '../entity/story.entity';

export class CreateStoryBody {
  @ApiProperty({ description: 'Author ID', format: 'uuid' })
  @IsUUID()
  authorId: string;

  @ApiProperty({
    description: 'Title of the story',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Short description of the story' })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Language of the story',
    enum: Language,
    default: Language.VIETNAMESE,
  })
  @IsEnum(Language)
  language: Language;

  @ApiProperty({ description: 'Content in Hmong', required: false })
  @IsString()
  @IsOptional()
  hmongContent?: string;

  @ApiProperty({ description: 'Content in English', required: false })
  @IsString()
  @IsOptional()
  englishContent?: string;

  @ApiProperty({ description: 'Content in Vietnamese', required: false })
  @IsString()
  @IsOptional()
  vietnameseContent?: string;

  @ApiProperty({
    description: 'Story status',
    enum: StoryStatus,
    default: StoryStatus.PENDING,
  })
  @IsEnum(StoryStatus)
  @IsOptional()
  status?: StoryStatus;
}

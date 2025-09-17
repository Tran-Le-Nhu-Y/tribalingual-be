import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { StoryStatus, Language } from '../entity/story.entity';

export class UpdateStoryBody {
  @IsUUID()
  @ApiProperty({
    description: 'User ID who performs the update',
    format: 'uuid',
  })
  userId: string;

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

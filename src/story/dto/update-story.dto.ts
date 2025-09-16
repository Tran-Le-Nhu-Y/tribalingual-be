import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateStoryBody {
  @IsUUID()
  @ApiProperty({
    description: 'User Id',
  })
  userId: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Story title' })
  title?: string;

  //   @IsOptional()
  //   @IsString()
  //   @ApiPropertyOptional({ description: 'Story content in Hmong language' })
  //   hmong?: string;

  //   @IsOptional()
  //   @IsString()
  //   @ApiPropertyOptional({ description: 'Story content in English language' })
  //   english?: string;

  //   @IsOptional()
  //   @IsString()
  //   @ApiPropertyOptional({ description: 'Story content in Vietnamese language' })
  //   vietnamese?: string;

  //   @IsOptional()
  //   @IsEnum(StoryStatus)
  //   @ApiPropertyOptional({
  //     description: 'Story status (PENDING, PUBLISHED, REJECTED, HIDDEN)',
  //   })
  //   status?: StoryStatus;
}

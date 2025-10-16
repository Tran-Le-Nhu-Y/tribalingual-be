import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { StoryAction } from '../entity/story-history.entity';

export class CreateStoryHistoryBody {
  @IsUUID()
  @ApiProperty({
    description: 'Story Id',
  })
  storyId: string;

  @ApiProperty({
    description: 'User Id',
  })
  userId: string;

  @IsEnum(StoryAction)
  @ApiProperty({
    description: 'Action performed on story',
    enum: StoryAction,
  })
  action: StoryAction;

  @ApiProperty({
    description: 'Date story history was created',
    required: false,
  })
  createdAt?: Date;

  // optional snapshot fields
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Snapshot title of story at the time of action',
    required: false,
  })
  storyTitle?: string;

  @IsOptional()
  @ApiProperty({
    description: 'Snapshot author id of story at the time of action',
    required: false,
  })
  storyAuthorId?: string;

  @IsOptional()
  @ApiProperty({
    description: 'Snapshot published date of story at the time of action',
    required: false,
    type: Date,
  })
  storyPublishedDate?: Date;
}

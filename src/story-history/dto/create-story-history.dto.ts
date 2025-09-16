import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { StoryAction } from '../entity/story-history.entity';

export class CreateStoryHistoryBody {
  @IsUUID()
  @ApiProperty({
    description: 'Story Id',
  })
  storyId: string;

  @IsUUID()
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
}

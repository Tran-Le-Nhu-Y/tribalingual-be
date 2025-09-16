import { ApiProperty } from '@nestjs/swagger';
import { StoryAction } from '../entity/story-history.entity';
import StoryResponse from 'src/story/dto/story-response.dto';

export default class StoryHistoryResponse {
  @ApiProperty({ description: 'History record ID' })
  id: string;

  @ApiProperty({ description: 'Action performed on story', enum: StoryAction })
  action: StoryAction;

  @ApiProperty({ description: 'User who performed the action' })
  userId: string;

  @ApiProperty({
    description: 'Story affected by this action (null if deleted)',
    type: () => StoryResponse,
    required: false,
  })
  story?: StoryResponse | null;

  @ApiProperty({ description: 'Date when history record was created' })
  createdAt: Date;

  // --- snapshot fields ---
  @ApiProperty({
    description: 'Snapshot of story title at the time of action',
    required: false,
  })
  storyTitle?: string;

  @ApiProperty({
    description: 'Snapshot of story author ID at the time of action',
    required: false,
  })
  storyAuthorId?: string;

  @ApiProperty({
    description: 'Snapshot published date of story at the time of action',
    required: false,
    type: Date,
  })
  storyPublishedDate?: Date;
}

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
    description: 'Story affected by this action',
    type: () => StoryResponse,
  })
  story: StoryResponse;

  @ApiProperty({ description: 'Date when history record was created' })
  createdAt: Date;
}

import { ApiProperty } from '@nestjs/swagger';
import UserResponse from 'src/user/dto/user-response';
import StoryResponse from './story-response.dto';
export class CommentResponse {
  @ApiProperty({
    description: 'Comment id',
    format: 'uuid',
  })
  id: string;
  @ApiProperty({
    description: 'Content of the comment',
    minLength: 1,
  })
  content: string;
  @ApiProperty({
    description: 'Date comment was created',
  })
  createdAt: Date;

  @ApiProperty({ type: () => StoryResponse })
  story: StoryResponse;

  @ApiProperty({ type: () => UserResponse })
  user: UserResponse;
}

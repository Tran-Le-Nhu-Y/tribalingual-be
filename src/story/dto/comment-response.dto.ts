import { ApiProperty } from '@nestjs/swagger';
import UserResponse from 'src/user/dto/user-response';
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

  @ApiProperty({
    description: 'Story id this comment belongs to',
    format: 'uuid',
  })
  storyId: string;

  @ApiProperty({
    description: 'User id this comment belongs to',
    format: 'string',
  })
  userId: string;

  @ApiProperty({
    description: 'Author of the comment',
    required: false,
    type: () => UserResponse,
  })
  user?: UserResponse | null;
}

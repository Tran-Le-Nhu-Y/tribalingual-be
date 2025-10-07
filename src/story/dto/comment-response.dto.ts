import { ApiProperty } from '@nestjs/swagger';
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
    format: 'uuid',
  })
  userId: string;
}

import { ApiProperty } from '@nestjs/swagger';
export default class CommentResponse {
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
  date: Date;
}

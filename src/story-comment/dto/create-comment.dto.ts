import { ApiProperty } from '@nestjs/swagger';
export default class CreateCommentBody {
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

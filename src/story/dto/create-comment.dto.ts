import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
export class CreateCommentBody {
  @IsUUID()
  @ApiProperty({
    description: 'Story Id',
    minLength: 1,
  })
  storyId: string;

  @IsUUID()
  @ApiProperty({
    description: 'Author Id',
    minLength: 1,
  })
  userId: string;

  @ApiProperty({
    description: 'Content of the comment',
    minLength: 1,
  })
  content: string;
}

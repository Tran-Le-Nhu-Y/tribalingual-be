import { ApiProperty } from '@nestjs/swagger';

export default class StoryResponse {
  @ApiProperty({ description: 'Story id', format: 'uuid' })
  id: string;

  @ApiProperty({
    description: 'Title of the story',
    minLength: 1,
    maxLength: 255,
  })
  title: string;

  @ApiProperty({ description: 'Author id', format: 'uuid' })
  authorId: string;

  @ApiProperty({ description: 'Date story was published' })
  publishedDate: Date;

  @ApiProperty({ description: 'Number of views' })
  viewCount: number;

  @ApiProperty({ description: 'Number of comments' })
  commentCount: number;

  @ApiProperty({ description: 'Number of likes (favorites)' })
  likeCount: number;
}

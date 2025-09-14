import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
export class CreateFavoriteBody {
  @IsUUID()
  @ApiProperty({
    description: 'Story Id',
    required: true,
  })
  storyId: string;

  @IsUUID()
  @ApiProperty({
    description: 'User Id',
    required: true,
  })
  userId: string;

  @ApiProperty({
    description: 'Date comment was created',
    required: false,
  })
  addedDate?: Date;
}

import { ApiProperty } from '@nestjs/swagger';
import UserResponse from 'src/user/dto/user-response.dto';
import StoryResponse from './story-response.dto';
export class FavoriteResponse {
  @ApiProperty({
    description: 'Date favorite was added',
  })
  addedDate: Date;

  @ApiProperty({ type: () => StoryResponse })
  story: StoryResponse;

  @ApiProperty({ type: () => UserResponse })
  user: UserResponse;
}

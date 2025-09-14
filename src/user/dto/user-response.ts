import { ApiProperty } from '@nestjs/swagger';

export default class UserResponse {
  @ApiProperty({ description: 'User id', format: 'uuid' })
  id: string;

  @ApiProperty({
    description: 'Username',
    minLength: 1,
    maxLength: 255,
  })
  username: string;
}

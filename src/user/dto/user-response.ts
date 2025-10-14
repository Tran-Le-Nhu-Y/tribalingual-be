import { ApiProperty } from '@nestjs/swagger';

export default class UserResponse {
  @ApiProperty({ description: 'User id', format: 'string' })
  id: string;

  @ApiProperty({
    description: 'Username',
    minLength: 1,
    maxLength: 255,
  })
  username: string;

  @ApiProperty({ description: 'Email', nullable: true })
  email?: string;

  @ApiProperty({ description: 'Avatar Url', nullable: true })
  avatarUrl?: string;
}

import { ApiProperty } from '@nestjs/swagger';

export default class UserResponse {
  @ApiProperty({ description: 'User id', format: 'string' })
  id: string;
}

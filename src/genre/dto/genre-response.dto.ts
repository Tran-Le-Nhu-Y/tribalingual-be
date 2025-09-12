import { ApiProperty } from '@nestjs/swagger';
export default class GenreResponse {
  @ApiProperty({
    description: 'Genre name',
    minLength: 1,
    maxLength: 100,
  })
  name: string;
  @ApiProperty({
    description: 'Genre description',
    minLength: 1,
    maxLength: 255,
  })
  description: string;
}

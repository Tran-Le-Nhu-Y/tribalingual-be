import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export default class CreateGenreBody {
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

  @IsEmail()
  email: string;
}

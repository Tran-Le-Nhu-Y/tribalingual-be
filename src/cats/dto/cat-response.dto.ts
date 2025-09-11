import { ApiProperty } from '@nestjs/swagger';

export default class CatResponse {
  @ApiProperty({
    description: 'Cat name',
    minLength: 1,
    maxLength: 255,
  })
  name: string;

  age: number;
}

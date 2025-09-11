/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export default class CreateCatBody {
  @ApiProperty({
    description: 'Cat name',
    minLength: 1,
    maxLength: 255,
  })
  name: string;

  @ApiProperty({
    description: 'Cat age',
    minimum: 0,
    maximum: 30,
  })
  age: number;

  @IsEmail()
  email: string;
}

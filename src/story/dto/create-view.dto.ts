import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
export class CreateViewBody {
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
    description: 'Last view date',
    required: false,
  })
  lastViewDate?: Date;
}

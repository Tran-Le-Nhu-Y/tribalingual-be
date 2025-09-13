import { ApiProperty } from '@nestjs/swagger';

export default class UploadFileBody {
  @ApiProperty({
    description: 'File name',
    minLength: 1,
    maxLength: 100,
  })
  name: string;
  @ApiProperty({
    description: 'File mime type',
  })
  mime_type: string;
  @ApiProperty({
    description: 'File save path',
  })
  save_path: string;
}

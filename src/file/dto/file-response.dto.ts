import { ApiProperty } from '@nestjs/swagger';
export default class FileResponse {
  @ApiProperty({
    description: 'File id',
    format: 'uuid',
  })
  id: string;
  @ApiProperty({
    description: 'File name',
    minLength: 1,
    maxLength: 100,
  })
  filename: string;
  @ApiProperty({
    description: 'File mime type',
  })
  mime_type: string;
  @ApiProperty({
    description: 'File size',
  })
  size: number;
  @ApiProperty({
    description: 'File URL',
  })
  url: string;
  @ApiProperty({
    description: 'Save path (for cloudinary)',
  })
  save_path: string;
}

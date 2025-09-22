import { ApiProperty } from '@nestjs/swagger';

export class PagingWrapper<T> {
  @ApiProperty({ isArray: true })
  content: T[];

  @ApiProperty()
  page_number: number;

  @ApiProperty()
  page_size: number;

  @ApiProperty()
  total_elements: number;

  @ApiProperty()
  total_pages: number;
}

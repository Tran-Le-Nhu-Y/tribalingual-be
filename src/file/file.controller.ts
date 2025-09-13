import {
  Controller,
  Get,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileMapper } from './file.mapper';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller({ path: '/api/v1/file' })
export class FileController {
  constructor(
    private readonly service: FileService,
    private readonly mapper: FileMapper,
  ) {}

  @Get('/all')
  @ApiOperation({ summary: 'Get all files metadata' })
  async getAllFiles() {
    const files = await this.service.findAll();
    return files.map((model) => this.mapper.toResponse(model));
  }

  @Post('/upload')
  @ApiOperation({ summary: 'Upload a file (single file), return id' })
  @ApiConsumes('multipart/form-data')
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async upload(
    @UploadedFile(
      new ParseFilePipeBuilder()
        //.addFileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }) // only jpg, jpeg, png
        .addMaxSizeValidator({ maxSize: 5 * 1024 * 1024 }) // max 5MB
        .build({ errorHttpStatusCode: 422 }), // return 422 if invalid
    )
    file: Express.Multer.File,
  ): Promise<{ id: string }> {
    const savedFile = await this.service.save_file(file);
    return { id: savedFile.id };
  }
}

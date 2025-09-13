import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
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

  @Get('/file/:id')
  @ApiOperation({ summary: 'Get file by id' })
  async getFileById(@Param('id') id: string) {
    const file = await this.service.findOne(id);
    if (!file) {
      throw new NotFoundException(`File with id ${id} not found`);
    }
    return this.mapper.toResponse(file);
  }

  @Post('/upload')
  @ApiOperation({ summary: 'Upload a file (single file), return id' })
  @ApiConsumes('multipart/form-data')
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
  async uploadFile(
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

  @Delete('/delete/:id')
  @ApiOperation({ summary: 'Delete a file by id' })
  async deleteFile(@Param('id') id: string) {
    const deleted = await this.service.remove(id);
    if (!deleted) {
      throw new NotFoundException(`File with id ${id} not found`);
    }
    return { message: `File with id ${id} deleted successfully` };
  }
}

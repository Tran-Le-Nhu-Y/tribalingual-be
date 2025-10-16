import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseFilePipeBuilder,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileMapper } from './file.mapper';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import FileResponse from './dto/file-response.dto';
import { PagingWrapper } from './dto/paging-wrapper.dto';
import { Permission } from 'src/auth/enum/permission.enum';
import { Permissions } from 'src/auth/permission.decorator';

@ApiTags('File')
@ApiBearerAuth('access-token')
@Controller({ path: '/api/v1/file' })
export class FileController {
  constructor(
    private readonly service: FileService,
    private readonly mapper: FileMapper,
  ) {}

  @Permissions(Permission.READ_FILE)
  @Get('/all')
  @ApiOperation({ summary: 'Get all files metadata' })
  @ApiResponse({ type: PagingWrapper })
  @ApiQuery({ name: 'offset', type: Number, required: false, example: 0 })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 20 })
  async getAllFiles(
    @Query('offset') offset = 0,
    @Query('limit') limit = 20,
  ): Promise<PagingWrapper<FileResponse>> {
    const [entities, total] = await this.service.findAllWithPaging(
      offset,
      limit,
    );
    const content = entities.map((model) => this.mapper.toResponse(model));
    return {
      content,
      page_number: Math.floor(offset / limit),
      page_size: limit,
      total_elements: total,
      total_pages: Math.ceil(total / limit),
    };
  }

  @Permissions(Permission.READ_FILE)
  @Get('/:id')
  @ApiOperation({ summary: 'Get file by id' })
  async getFileById(@Param('id') id: string) {
    const file = await this.service.findOne(id);
    if (!file) {
      throw new NotFoundException(`File with id ${id} not found`);
    }
    return this.mapper.toResponse(file);
  }

  @Permissions(Permission.CREATE_FILE)
  @Post('/upload')
  @ApiOperation({ summary: 'Upload a file (single file), return id' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiCreatedResponse({ type: FileResponse })
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
  @ApiInternalServerErrorResponse({ description: 'File upload failed' })
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        //.addFileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }) // only jpg, jpeg, png
        .addMaxSizeValidator({ maxSize: 5 * 1024 * 1024 }) // max 5MB
        .build({ errorHttpStatusCode: 422 }), // return 422 if invalid
    )
    file: Express.Multer.File,
  ) {
    const savedFile = await this.service.save_file(file);
    return savedFile;
  }

  @Permissions(Permission.DELETE_FILE)
  @Delete('/:id/delete')
  @ApiOperation({ summary: 'Delete a file by id' })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'File with id ${id} deleted successfully',
      },
    },
  })
  async deleteFile(@Param('id') id: string) {
    const deleted = await this.service.remove(id);
    if (!deleted) {
      throw new NotFoundException(`File with id ${id} not found`);
    }
    return { message: `File with id ${id} deleted successfully` };
  }
}

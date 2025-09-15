import { Injectable } from '@nestjs/common';
import FileEntity from './entity/file.entity';
import File from './interface/file.interface';
import FileResponse from './dto/file-response.dto';

@Injectable()
export class FileMapper {
  toModel(entity: FileEntity) {
    return {
      id: entity.id,
      filename: entity.filename,
      mime_type: entity.mime_type,
      size: entity.size,
      url: entity.url,
      publicId: entity.publicId,
    } as File;
  }

  toResponse(model: File) {
    return {
      ...model,
    } as FileResponse;
  }
}

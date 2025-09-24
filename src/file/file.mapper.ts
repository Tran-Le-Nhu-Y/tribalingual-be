import { Injectable } from '@nestjs/common';
import FileEntity from './entity/file.entity';
import File from './interface/file.interface';
import FileResponse from './dto/file-response.dto';

@Injectable()
export class FileMapper {
  toModel(entity: FileEntity) {
    return {
      id: entity.id,
      storyId: entity.storyId,
      name: entity.name,
      mime_type: entity.mime_type,
      size: entity.size,
      url: entity.url,
      save_path: entity.save_path,
    } as File;
  }

  toResponse(model: File) {
    return {
      ...model,
    } as FileResponse;
  }
}

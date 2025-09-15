import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import FileEntity from './entity/file.entity';
import { FileMapper } from './file.mapper';
import File from './interface/file.interface';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private fileRepository: Repository<FileEntity>,
    private readonly mapper: FileMapper,
  ) {}

  async findAll(): Promise<File[]> {
    const entities = await this.fileRepository.find();
    return entities.map((entity) => this.mapper.toModel(entity));
  }

  async findOne(id: string): Promise<File | null> {
    const entity = await this.fileRepository.findOneBy({ id });
    return entity !== null ? this.mapper.toModel(entity) : null;
  }

  async save_file(file: Express.Multer.File): Promise<FileEntity> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const fileRecord = this.fileRepository.create({
      filename: file.originalname,
      mime_type: file.mimetype,
      size: file.size,
      url: file.path, // Cloudinary URL
      publicId: file.filename, // Cloudinary public_id
    });
    return await this.fileRepository.save(fileRecord);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.fileRepository.delete(id);
    return result.affected !== 0; // true if a row was deleted, false otherwise
  }
}

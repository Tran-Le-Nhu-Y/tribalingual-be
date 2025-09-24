import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import FileEntity from './entity/file.entity';
import { FileMapper } from './file.mapper';
import File from './interface/file.interface';
import { v2 as cloudinary } from 'cloudinary';

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

  async findAllWithPaging(
    offset: number,
    limit: number,
  ): Promise<[File[], number]> {
    return this.fileRepository.findAndCount({
      skip: offset,
      take: limit,
      order: { name: 'ASC' },
    });
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
      name: file.originalname,
      mime_type: file.mimetype,
      size: file.size,
      url: file.path, // Cloudinary URL
      save_path: file.filename, // Cloudinary save_path
    });
    return await this.fileRepository.save(fileRecord);
  }

  async remove(id: string): Promise<boolean> {
    const file = await this.fileRepository.findOne({ where: { id } });
    if (!file) {
      throw new NotFoundException(`File with id ${id} not found`);
    }

    try {
      // Delete file in cloud
      if (file.save_path) {
        await cloudinary.uploader.destroy(file.save_path);
      }

      const result = await this.fileRepository.delete(id);
      return result.affected !== 0;
    } catch (error) {
      console.error('Error removing file:', error);
      throw new Error('Cannot remove file');
    }
  }
}

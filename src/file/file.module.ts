import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import FileEntity from './entity/file.entity';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { FileMapper } from './file.mapper';
import { MulterModule } from '@nestjs/platform-express';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // 🔹 Config Cloudinary
        cloudinary.config({
          cloud_name: configService.get('cloudinary.cloud_name'),
          api_key: configService.get('cloudinary.api_key'),
          api_secret: configService.get('cloudinary.api_secret'),
        });
        // 🔹 Storage config
        const storage = new CloudinaryStorage({
          cloudinary: cloudinary,
          params: (_req, file) => {
            return {
              folder: 'tribalingual_thumbnail_uploads',
              public_id: file.originalname.split('.')[0],
              resource_type: 'auto',
            };
          },
        });
        return { storage };
      },
    }),
  ],
  controllers: [FileController],
  providers: [FileService, FileMapper],
  exports: [FileService],
})
export class FileModule {}

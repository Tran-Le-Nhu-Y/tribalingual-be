import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import GenreEntity from './entity/genre.entity';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { GenreMapper } from './genre.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([GenreEntity])],
  controllers: [GenreController],
  providers: [GenreService, GenreMapper],
  exports: [GenreService],
})
export class GenreModule {}

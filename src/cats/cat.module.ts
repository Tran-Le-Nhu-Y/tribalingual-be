import { Module } from '@nestjs/common';
import { CatController } from './cat.controller';
import { CatService } from './cat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import CatEntity from './entity/cat.entity';
import { CatMapper } from './cat.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([CatEntity])],
  controllers: [CatController],
  providers: [CatService, CatMapper],
  exports: [CatService],
})
export class CatModule {}

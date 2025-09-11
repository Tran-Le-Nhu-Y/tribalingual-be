import { Injectable } from '@nestjs/common';
import CatResponse from './dto/cat-response.dto';
import CatEntity from './entity/cat.entity';
import Cat from './interface/cat.interface';

@Injectable()
export class CatMapper {
  toModel(entity: CatEntity) {
    return {
      name: entity.name,
      age: entity.age,
      breed: entity.breed,
    } as Cat;
  }

  toResponse(model: Cat) {
    return {
      ...model,
    } as CatResponse;
  }
}

import { Injectable } from '@nestjs/common';

import { UserEntity } from './entity/user.entity';
import User from './interface/user.interface';
import UserResponse from './dto/user-response.dto';

@Injectable()
export class UserMapper {
  toModel(entity: UserEntity) {
    return {
      id: entity.id,
    } as User;
  }

  toResponse(model: User) {
    return {
      ...model,
    } as UserResponse;
  }
}

import { Injectable } from '@nestjs/common';

import { UserEntity } from './entity/user.entity';
import User from './interface/user.interface';
import UserResponse from './dto/user-response';

@Injectable()
export class UserMapper {
  toModel(entity: UserEntity) {
    return {
      id: entity.id,
      username: entity.username,
    } as User;
  }

  toResponse(model: User) {
    return {
      ...model,
    } as UserResponse;
  }
}

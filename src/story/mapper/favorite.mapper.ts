import { Injectable } from '@nestjs/common';
import { StoryMapper } from './story.mapper';
import { FavoriteResponse } from '../dto/favorite-response.dto';
import { FavoriteEntity } from '../entity/favorite.entity';
import { UserMapper } from 'src/user/user.mapper';

@Injectable()
export class FavoriteMapper {
  constructor(
    private readonly storyMapper: StoryMapper,
    private readonly userMapper: UserMapper,
  ) {}

  toResponse(entity: FavoriteEntity): FavoriteResponse {
    return {
      addedDate: entity.addedDate,
      story: this.storyMapper.toResponse(entity.story),
      user: this.userMapper.toResponse(entity.user),
    };
  }
}

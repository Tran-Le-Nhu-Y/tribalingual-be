import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  /**
   * Ensure user from Auth0 exists in local DB
   * @param auth0User - user info from Auth0 (contains sub, name/email)
   */
  async syncUserFromAuth0(auth0User: {
    sub: string;
    name?: string;
    email?: string;
    picture?: string;
  }): Promise<UserEntity> {
    let user = await this.userRepository.findOneBy({ id: auth0User.sub });

    if (!user) {
      user = this.userRepository.create({
        id: auth0User.sub,
        username: auth0User.name || auth0User.email?.split('@')[0] || 'Unknown',
        email: auth0User.email,
        avatarUrl: auth0User.picture,
      });
    } else {
      user.username = auth0User.name || user.username;
      user.email = auth0User.email ?? user.email;
      user.avatarUrl = auth0User.picture ?? user.avatarUrl;
    }

    return await this.userRepository.save(user);
  }
}

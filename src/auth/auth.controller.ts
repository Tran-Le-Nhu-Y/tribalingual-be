import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth0UserDto } from './dto/auth0-user.dto';
import { UserEntity } from 'src/user/entity/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sync')
  async syncUser(@Body() userData: Auth0UserDto): Promise<UserEntity> {
    return this.authService.syncUserFromAuth0(userData);
  }
}

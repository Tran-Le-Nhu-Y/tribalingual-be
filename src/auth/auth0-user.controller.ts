import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { Auth0UserService } from './auth0-user.service';
import { Permissions } from './permission.decorator';
import { Permission } from './enum/permission.enum';
import { Auth0UserDto } from 'src/user/dto/sync-user.dto';

@Controller('auth0-user')
export class Auth0UserController {
  constructor(private readonly auth0UserService: Auth0UserService) {}

  @Get(':id')
  @Permissions(Permission.READ_USER)
  async getUser(@Param('id') id: string) {
    return this.auth0UserService.getUserProfile(id);
  }

  @Post('sync')
  async syncUser(@Body() userData: Auth0UserDto) {
    const syncUser = await this.auth0UserService.syncUserFromAuth0(userData);
    if (!syncUser) {
      throw new NotFoundException(`Sync user with id ${userData.id} failed`);
    }
    return {
      message: `Sync user with id ${userData.id} deleted successfully`,
    };
  }
}

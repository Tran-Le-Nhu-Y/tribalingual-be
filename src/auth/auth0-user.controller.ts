import { Body, Controller, Get, Param } from '@nestjs/common';
import { Auth0UserService } from './auth0-user.service';
import { Permissions } from './permission.decorator';
import { Permission } from './enum/permission.enum';

@Controller('auth0-user')
export class Auth0UserController {
  constructor(private readonly auth0UserService: Auth0UserService) {}

  @Get(':id')
  @Permissions(Permission.READ_USER)
  async getUser(@Param('id') id: string) {
    return this.auth0UserService.getUserProfile(id);
  }
}

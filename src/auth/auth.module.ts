import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PermissionsGuard } from './permission.guard';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entity/user.entity';
import { Auth0UserService } from './auth0-user.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([UserEntity])],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    Auth0UserService,
  ],
})
export class AuthModule {}

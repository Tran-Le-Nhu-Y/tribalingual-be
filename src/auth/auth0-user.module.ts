import { Module } from '@nestjs/common';
import { Auth0UserService } from './auth0-user.service';
import { Auth0UserController } from './auth0-user.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entity/user.entity';

@Module({
  imports: [
    ConfigModule.forFeature(configuration),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [Auth0UserController],
  providers: [Auth0UserService],
  exports: [Auth0UserService],
})
export class Auth0UserModule {}

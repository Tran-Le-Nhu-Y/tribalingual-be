import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreModule } from './genre/genre.module';
import { FileModule } from './file/file.module';
import { StoryModule } from './story/story.module';
import { StoryHistoryModule } from './story-history/story-history.module';
import { AuthModule } from './auth/auth.module';
import { Auth0UserModule } from './auth/auth0-user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: +configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.dbname'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    GenreModule,
    FileModule,
    StoryModule,
    StoryHistoryModule,
    Auth0UserModule,
  ],
})
export class AppModule {}

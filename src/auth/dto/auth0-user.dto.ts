import { IsEmail, IsOptional, IsString } from 'class-validator';

export class Auth0UserDto {
  @IsString()
  sub: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  picture?: string;
}

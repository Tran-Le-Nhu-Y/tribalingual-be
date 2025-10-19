import { IsString } from 'class-validator';

export class Auth0UserDto {
  @IsString()
  id: string;
}

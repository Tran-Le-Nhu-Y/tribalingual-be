import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from './enum/permission.enum';
import { PERMISSIONS_KEY } from './permission.decorator';
import { JwtService } from '@nestjs/jwt';
import JWTPayload from './interface/payload.interface';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissions) return true;

    const accessToken = this.extractTokenFromHeader(
      context.switchToHttp().getRequest(),
    );
    if (accessToken === undefined) return false;

    const payload = await this.jwtService.verifyAsync<JWTPayload>(accessToken);
    return requiredPermissions.every((permission) =>
      payload.permissions.includes(permission),
    );
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.get('authorization')?.split(' ') ?? [];
    if (authHeader.length !== 2) return undefined;
    const [type, token] = authHeader;
    return type === 'Bearer' ? token : undefined;
  }
}

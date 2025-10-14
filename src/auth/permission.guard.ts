import { ConfigService } from '@nestjs/config';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from './enum/permission.enum';
import { PERMISSIONS_KEY } from './permission.decorator';
import { createRemoteJWKSet, jwtVerify, JWTVerifyOptions } from 'jose';
import AuthzPayload from './interface/jwt.interface';

@Injectable()
export class PermissionsGuard implements CanActivate {
  readonly JWKS: ReturnType<typeof createRemoteJWKSet>;
  readonly verifyOptions: JWTVerifyOptions;

  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
  ) {
    const jwksUrl = this.configService.get<string>('auth0.jwks');
    if (jwksUrl === undefined) throw new Error('Please configure JWKs URL.');
    this.JWKS = createRemoteJWKSet(new URL(jwksUrl));
    this.verifyOptions = {
      audience: this.configService.get<string>('auth0.audience'),
      issuer: this.configService.get<string>('auth0.issuer'),
      algorithms: ['RS256'],
    };
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissions) return true;

    try {
      const accessToken = this.extractTokenFromHeader(
        context.switchToHttp().getRequest(),
      );
      if (accessToken === undefined) return false;

      const { payload } = await jwtVerify<AuthzPayload>(
        accessToken,
        this.JWKS,
        this.verifyOptions,
      );

      return requiredPermissions.every((permission) =>
        payload.permissions.includes(permission),
      );
    } catch (error) {
      console.warn(error);
      return false;
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const headers = request.headers as unknown as Record<string, string>;
    const authHeader = headers['authorization']?.split(' ') ?? [];
    if (authHeader.length !== 2) return undefined;
    const [type, token] = authHeader;
    return type === 'Bearer' ? token : undefined;
  }
}

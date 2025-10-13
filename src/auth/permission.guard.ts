import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from './enum/permission.enum';
import { PERMISSIONS_KEY } from './permission.decorator';
import { auth, requiredScopes } from 'express-oauth2-jwt-bearer';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissions) {
      return true;
    }

    const checkJwt = auth({
      audience: 'http://localhost:3000',
      issuerBaseURL: 'https://tribalingual.jp.auth0.com/',
    });

    const http = context.switchToHttp();
    const isok = requiredScopes(requiredPermissions)(
      http.getRequest(),
      http.getResponse(),
      http.getNext(),
    );
  }
}

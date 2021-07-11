import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { AccountType } from '../jwt-auth/dto/jwt-auth.dto';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowUnauthenticated = this.reflector.get<boolean>('allow-unauthenticated', context.getHandler());

    if (allowUnauthenticated) return true;

    const request = context.switchToHttp().getRequest() as Request;
    if (process.env.NODE_ENV !== 'production' && request.authenticationType === 'development') {
      return false;
    }
    if (!request?.user) return false;

    const allowAnyPermission = this.reflector.get<boolean>('allow-any-permissions', context.getHandler());
    if (allowAnyPermission) return true;

    const roles = this.reflector.get<AccountType[]>('roles', context.getHandler());
    if (!request.user || !roles) {
      return false;
    }

    return roles.includes(request.user.accountType);
  }
}

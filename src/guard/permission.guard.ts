import { Injectable, CanActivate, ExecutionContext, ContextType } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { AccountType } from '../jwt-auth/dto/jwt-auth.dto';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowUnauthenticated = this.reflector.get<boolean>('allow-unauthenticated', context.getHandler());

    if (allowUnauthenticated) return true;

    let request: Request;
    if (context.getType() === ('graphql' as ContextType)) {
      request = GqlExecutionContext.create(context).getContext().req;
    } else {
      request = context.switchToHttp().getRequest();
    }
    if (!(process.env.NODE_ENV !== 'production' && request.authenticationType === 'development')) {
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

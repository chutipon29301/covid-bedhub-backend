import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

export const UserToken = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request: Request = ctx.switchToHttp().getRequest();
  return request.user;
});

export const GqlUserToken = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request: Request = GqlExecutionContext.create(ctx).getContext().req;
  return request.user;
});

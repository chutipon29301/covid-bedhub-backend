import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const UserToken = createParamDecorator((data: unknown, request: Request) => {
  return request.user;
});

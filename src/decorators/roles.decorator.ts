import { SetMetadata } from '@nestjs/common';
import { AccountType } from '../jwt-auth/dto/jwt-auth.dto';

export const Roles = (...args: AccountType[]) => SetMetadata('roles', args);

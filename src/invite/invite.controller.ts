import { Controller, Get, NotFoundException, Param } from '@nestjs/common';

import { AllowUnauthenticated } from '../decorators/allow-unauthenticated.decorator';
import { InviteService } from './invite.service';
import { AccessCode } from '../entities';
import { UserToken } from '../decorators/user-token.decorator';
import { JwtPayload } from '../jwt-auth/dto/jwt-auth.dto';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('invite')
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}
  @Roles('code_generator')
  @Get()
  async listAccessCode(@UserToken() user: JwtPayload): Promise<AccessCode[]> {
    return this.inviteService.findMany(user.id);
  }
  @AllowUnauthenticated
  @Get('/:code')
  async getValidAccessCode(@Param('code') code: string): Promise<AccessCode> {
    return this.inviteService.checkAccessCodeValid(code);
  }
}

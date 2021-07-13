import { Controller, Get, NotFoundException, Param } from '@nestjs/common';

import { AccessCode } from '@entity';
import { AllowUnauthenticated, UserToken, Roles } from '@decorator';

import { InviteService } from './invite.service';
import { JwtPayload } from '../jwt-auth/dto/jwt-auth.dto';

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

import { Controller, Get, Param } from '@nestjs/common';

import { AllowUnauthenticated } from '../decorators/allow-unauthenticated.decorator';
import { InviteService } from './invite.service';
import { AccessCode } from '../entities';

@Controller('invite')
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  @AllowUnauthenticated
  @Get('/:code')
  async getValidAccessCode(@Param('code') accessCode: string): Promise<AccessCode> {
    return this.inviteService.checkAccessCodeValid(accessCode);
  }
}

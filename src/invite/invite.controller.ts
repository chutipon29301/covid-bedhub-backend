import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AllowUnauthenticated } from 'src/decorators/allow-unauthenticated.decorator';
import { AccessCode } from 'src/entities/AccessCode.entity';
import { InviteService } from './invite.service';

@Controller('invite')
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}
  @AllowUnauthenticated
  @Get('/:code')
  async getValidAccessCode(@Param('code') accessCode: string): Promise<AccessCode> {
    console.log(accessCode);
    return this.inviteService.checkAccessCodeValid(accessCode);
  }
}

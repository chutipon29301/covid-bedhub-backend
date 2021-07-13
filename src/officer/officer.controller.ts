import { Body, Controller, Get, Patch, UnauthorizedException } from '@nestjs/common';

import { Officer } from '@entity';
import { IdParam, Roles, UserToken } from '@decorator';
import { UpdateOfficerDto } from './dto/officer.dto';
import { OfficerService } from './officer.service';
import { JwtPayload } from '../jwt-auth/dto/jwt-auth.dto';

@Controller('Officer')
export class OfficerController {
  constructor(private readonly officerService: OfficerService) {}

  @Roles('code_generator', 'queue_manager')
  @Get('/:id')
  async get(@UserToken() user: JwtPayload, @IdParam() id: number): Promise<Officer> {
    if (user.id == id) {
      return this.officerService.findOne({ id });
    }
    throw new UnauthorizedException('User not authorize to perform this action');
  }

  @Roles('queue_manager')
  @Patch('/:id')
  async edit(@UserToken() user: JwtPayload, @IdParam() id: number, @Body() officer: UpdateOfficerDto) {
    if (user.id == id) {
      return this.officerService.updateOne({ id }, officer);
    }
    throw new UnauthorizedException('User not authorize to perform this action');
  }
  s;
}

import { Controller, Get, Param, Patch, Query, UnauthorizedException } from '@nestjs/common';

import { Roles } from '../decorators/roles.decorator';
import { UserToken } from '../decorators/user-token.decorator';
import { JwtPayload } from '../jwt-auth/dto/jwt-auth.dto';
import { AppointmentService } from './appointment.service';
import { CheckTicketDto } from './dto/appointment.dto';

@Controller('Appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}
  @Roles('queue_manager', 'staff')
  @Get('/check')
  async checkTicket(@UserToken() user: JwtPayload, @Query() query: CheckTicketDto) {
    return this.appointmentService.getAppointmentTicket(user.id, query.nid);
  }
}

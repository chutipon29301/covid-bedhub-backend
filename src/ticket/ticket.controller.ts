import { Controller, Get } from '@nestjs/common';
import { AllowAnyPermission } from '../decorators/allow-any-permission.decorator';
import { TicketService } from './ticket.service';

@Controller('ticket')
export class TicketController {
  constructor(private readonly service: TicketService) {}

  @AllowAnyPermission
  @Get('')
  tickets() {
    return this.service.findMany({ relations: ['patient'] });
  }
}

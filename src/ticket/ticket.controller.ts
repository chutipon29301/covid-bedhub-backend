import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { UserToken } from '../decorators/user-token.decorator';
import { JwtPayload } from '../jwt-auth/dto/jwt-auth.dto';
import { AllowUnauthenticated } from '../decorators/allow-unauthenticated.decorator';
import { IdParam } from '../decorators/id.decorator';
import { Ticket, TicketStatus } from '../entities/Ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketService } from './ticket.service';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}
  @AllowUnauthenticated
  @Get()
  async list(@UserToken() user: JwtPayload): Promise<Ticket[]> {
    const user_id = 1;
    return this.ticketService.listAllTicketsOfProfile(user_id);
  }

  @AllowUnauthenticated
  @Post()
  async add(@Body() body: CreateTicketDto): Promise<Ticket> {
    return await this.ticketService.createOne(body);
  }

  @Patch('/:id')
  async edit(@IdParam() id: number, @Body() Ticket: UpdateTicketDto) {
    return this.ticketService.updateOne({ id }, Ticket);
  }

  @AllowUnauthenticated
  @Patch('/cancel/:id')
  async cancel(@IdParam() id: number) {
    const cancelTicket = new Ticket();
    cancelTicket.status = TicketStatus.PATIENT_CANCEL;
    return this.ticketService.updateOne({ id }, cancelTicket);
  }

  @Delete('/:id')
  async delete(@IdParam() id: number) {
    await this.ticketService.deleteOne({
      where: { id },
    });
  }
}

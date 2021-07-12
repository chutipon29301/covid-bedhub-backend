import { Body, Controller, Delete, Get, InternalServerErrorException, Patch, Post, Query } from '@nestjs/common';
import { UserToken } from '../decorators/user-token.decorator';
import { JwtPayload } from '../jwt-auth/dto/jwt-auth.dto';
import { AllowUnauthenticated } from '../decorators/allow-unauthenticated.decorator';
import { IdParam } from '../decorators/id.decorator';
import { Ticket, TicketStatus } from '../entities/Ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketService } from './ticket.service';
import { differenceInDays, parseISO } from 'date-fns';
import { QueryTicketDto } from './dto/list-ticket.dto';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Roles('reporter')
  @Get()
  async list(@UserToken() user: JwtPayload): Promise<Ticket[]> {
    return this.ticketService.listAllTicketsOfReporter(user.id);
  }
  @Roles('queue_manager')
  @Get('/hospital')
  async listHospitalTicket(@UserToken() user: JwtPayload, @Query() query: QueryTicketDto): Promise<Ticket[]> {
    return this.ticketService.listAllHospitalTickets(user.id, query.ticketStatus);
  }

  @Roles('reporter', 'queue_manager')
  @Post()
  async add(@Body() body: CreateTicketDto): Promise<Ticket> {
    return await this.ticketService.createOne(body);
  }

  @Patch('/:id')
  async edit(@IdParam() id: number, @Body() Ticket: UpdateTicketDto) {
    return this.ticketService.updateOne({ id }, Ticket);
  }

  @Roles('reporter', 'queue_manager')
  @Patch('/cancel/:id')
  async cancel(@IdParam() id: number) {
    const currentTicket = await this.ticketService.findOne({ id });
    switch (currentTicket.status) {
      case TicketStatus.REQUEST:
        currentTicket.status = TicketStatus.PATIENT_CANCEL;
        return this.ticketService.updateOne({ id }, currentTicket);
      case TicketStatus.ACCEPTED:
        if (currentTicket.appointedDate) {
          const dateDiff = differenceInDays(parseISO(currentTicket.appointedDate), new Date());
          if (dateDiff <= 3) {
            throw new InternalServerErrorException('Ticket cannot be cancelled within 3 days');
          }
          console.log(dateDiff);
          currentTicket.status = TicketStatus.PATIENT_CANCEL;
          return this.ticketService.updateOne({ id }, currentTicket);
        }
        throw new InternalServerErrorException('No appointment date'); // To be discusss
      case TicketStatus.PATIENT_CANCEL:
        throw new InternalServerErrorException('Ticket already cancelled by the patient');
      case TicketStatus.HOSPITAL_CANCEL:
        throw new InternalServerErrorException('Ticket already cancelled by the hospital');
      default:
        throw new InternalServerErrorException('Cannot cancelled ticket');
    }
  }

  @Delete('/:id')
  async delete(@IdParam() id: number) {
    await this.ticketService.deleteOne({
      where: { id },
    });
  }
}

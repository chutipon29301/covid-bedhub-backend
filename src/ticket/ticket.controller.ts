import { Body, Controller, Delete, Get, Patch, Post, Query, UnauthorizedException } from '@nestjs/common';
import { UserToken, IdParam, Roles } from '@decorator';
import { JwtPayload } from '../jwt-auth/dto/jwt-auth.dto';
import { Ticket, TicketStatus } from '@entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateHospitalTicketDto, UpdatePatientTicketDto } from './dto/update-ticket.dto';
import { TicketService } from './ticket.service';
import { differenceInDays, parseISO } from 'date-fns';
import { QueryTicketDto } from './dto/list-ticket.dto';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Roles('reporter')
  @Get()
  async listTicketOfReporter(@UserToken() user: JwtPayload): Promise<Ticket[]> {
    return this.ticketService.listAllTicketsOfReporter(user.id);
  }

  @Roles('reporter')
  @Get('/:id')
  async list(@UserToken() user: JwtPayload, @IdParam() id: number): Promise<Ticket[]> {
    // return this.ticketService.listAllTicketsOfReporter(user.id);
    return;
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
  @Roles('reporter')
  @Patch('/:id')
  async edit(@UserToken() user: JwtPayload, @IdParam() id: number, @Body() ticket: UpdatePatientTicketDto) {
    return this.ticketService.updateOne({ id }, ticket);
  }

  @Roles('queue_manager')
  @Patch('/hospital/:id')
  async editHospitalTicket(
    @UserToken() user: JwtPayload,
    @IdParam() id: number,
    @Body() ticket: UpdateHospitalTicketDto,
  ) {
    if ([TicketStatus.MATCH, TicketStatus.PATIENT_CANCEL, TicketStatus.REQUEST].includes(ticket.status)) {
      return new UnauthorizedException('Hospital cannot perform this action');
    }
    return this.ticketService.updateOne({ id }, ticket);
  }

  @Roles('reporter')
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
            throw new UnauthorizedException('Ticket cannot be cancelled within 3 days');
          }
          console.log(dateDiff);
          currentTicket.status = TicketStatus.PATIENT_CANCEL;
          return this.ticketService.updateOne({ id }, currentTicket);
        }
        throw new UnauthorizedException('No appointment date'); // To be discusss
      case TicketStatus.PATIENT_CANCEL:
        throw new UnauthorizedException('Ticket already cancelled by the patient');
      case TicketStatus.HOSPITAL_CANCEL:
        throw new UnauthorizedException('Ticket already cancelled by the hospital');
      default:
        throw new UnauthorizedException('Cannot cancelled ticket');
    }
  }

  @Delete('/:id')
  async delete(@IdParam() id: number) {
    await this.ticketService.deleteOne({
      where: { id },
    });
  }
}

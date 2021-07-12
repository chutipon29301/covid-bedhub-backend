import { AllowAnyPermission } from '../decorators/allow-any-permission.decorator';
import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { AllowUnauthenticated } from '../decorators/allow-unauthenticated.decorator';
import { IdParam } from '../decorators/id.decorator';
import { Ticket } from '../entities/Ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketService } from './ticket.service';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get()
  async list(): Promise<Ticket[]> {
    return this.ticketService.findMany();
  }

  @AllowUnauthenticated
  @Post()
  async add(@Body() body: CreateTicketDto): Promise<Ticket> {
    return await this.ticketService.createOne(body);
    // return await this.ticketService.create(body);
  }

  @Patch('/:id')
  async edit(@IdParam() id: number, @Body() Ticket: UpdateTicketDto) {
    return this.ticketService.updateOne({ id }, Ticket);
  }

  @Delete('/:id')
  async delete(@IdParam() id: number) {
    await this.ticketService.deleteOne({
      where: { id },
    });
  }
}

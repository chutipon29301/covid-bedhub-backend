import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket, Patient, Vaccine, Officer } from '@entity';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, Vaccine, Patient, Officer])],
  providers: [TicketService],
  controllers: [TicketController],
})
export class TicketModule {}

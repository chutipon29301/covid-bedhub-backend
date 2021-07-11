import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from '../entities/Ticket.entity';
import { Vaccine } from '../entities/Vaccine.entity';
import { Patient } from '../entities/Patient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, Vaccine, Patient])],
  providers: [TicketService],
  controllers: [TicketController],
})
export class TicketModule {}

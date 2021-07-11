import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from '../entities/Ticket.entity';
import { Vaccine } from 'src/entities/Vaccine.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, Vaccine])],
  providers: [TicketService],
  controllers: [TicketController],
})
export class TicketModule {}

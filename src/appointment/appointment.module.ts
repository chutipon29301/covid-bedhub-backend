import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Officer, Patient, Ticket } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, Patient, Officer])],
  providers: [AppointmentService],
  controllers: [AppointmentController],
})
export class AppointmentModule {}

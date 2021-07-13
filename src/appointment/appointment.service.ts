import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Officer, Patient, Ticket, TicketStatus } from '../entities';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Ticket) private readonly ticketRepo: Repository<Ticket>,
    @InjectRepository(Officer) private readonly officerRepo: Repository<Officer>,
    @InjectRepository(Patient) private readonly patientRepo: Repository<Patient>,
  ) {}

  public async getAppointmentTicket(userId: number, nid: string): Promise<Ticket> {
    const officer = await this.officerRepo.findOne({ id: userId });
    const patient = await this.patientRepo.findOne({ where: { identification: nid } });
    const appointmentTicket = await this.ticketRepo.findOne({
      where: {
        hospitalId: officer.hospitalId,
        patientId: patient.id,
        status: TicketStatus.ACCEPTED,
      },
      order: { id: 'DESC' },
    });
    if (appointmentTicket) {
      return appointmentTicket;
    }
    throw new NotFoundException('Ticket not found');
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient, Reporter, Ticket } from '@entity';
import { CrudService } from '../libs/crud.service';

@Injectable()
export class ReporterService extends CrudService<Reporter> {
  constructor(
    @InjectRepository(Reporter) repo: Repository<Reporter>,
    @InjectRepository(Patient) private readonly patientRepo: Repository<Patient>,
    @InjectRepository(Ticket) private readonly ticketRepo: Repository<Ticket>,
  ) {
    super(repo);
  }

  async findPatients(reporterId: number): Promise<Patient[]> {
    return this.patientRepo.find({ where: { reporterId } });
  }

  async findTickets(reporterId: number): Promise<Ticket[]> {
    return this.ticketRepo
      .createQueryBuilder('ticket')
      .leftJoin('ticket.patient', 'patient')
      .where('patient.reporterId = :reporterId', { reporterId })
      .orderBy('ticket.updatedAt')
      .getMany();
  }
}

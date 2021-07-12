import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vaccine } from '../entities/Vaccine.entity';
import { In, Repository } from 'typeorm';
import { Symptom, Ticket, TicketStatus } from '../entities/Ticket.entity';
import { CrudService } from '../libs/crud.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Officer } from '../entities/Officer.entity';

@Injectable()
export class TicketService extends CrudService<Ticket> {
  constructor(
    @InjectRepository(Officer) private readonly officerRepo: Repository<Officer>,
    @InjectRepository(Vaccine) private readonly vaccineRepo: Repository<Vaccine>,
    @InjectRepository(Ticket) repo: Repository<Ticket>,
  ) {
    super(repo);
  }
  public async listAllTicketsOfProfile(userId: number): Promise<Ticket[]> {
    const tickets = await this.repo
      .createQueryBuilder('ticket')
      .innerJoinAndSelect('ticket.patient', 'patient')
      .where('patient.userId = :userId', { userId })
      .getMany();
    return tickets;
  }
  public async listAllHospitalTickets(userId: number, ticketStatus: TicketStatus): Promise<Ticket[]> {
    const officer = await this.officerRepo.findOne({ id: userId });
    if (officer && ticketStatus) {
      return await this.repo.find({ where: { hospitalId: officer.hospitalId, status: ticketStatus } });
    }
    return await this.repo.find({ where: { hospitalId: officer.hospitalId, relation: ['patient'] } });
  }
  public async createOne(body: CreateTicketDto): Promise<Ticket> {
    // body.
    const existingTicket = await this.repo.find({
      where: {
        patientId: body.patientId,
        status: In([TicketStatus.ACCEPTED, TicketStatus.MATCH, TicketStatus.REQUEST]),
      },
    });
    if (existingTicket.length > 0) {
      throw new InternalServerErrorException('Patient already create ticket');
    }
    const ticket = new Ticket();
    ticket.patientId = body.patientId;
    ticket.examReceiveDate = body.examReceiveDate;
    ticket.examDate = body.examDate;
    ticket.symptoms = body.symptoms;
    const risk1 = [Symptom.FEVER, Symptom.COUGH, Symptom.SMELLESS_RASH];
    const risk2 = [Symptom.DIARRHEA, Symptom.TIRED_HEADACHE, Symptom.DIFFICULT_BREATHING, Symptom.ANGINA];
    const risk3 = [Symptom.EXHAUSTED, Symptom.CHEST_PAIN, Symptom.UNCONCIOUS];
    const risks = [risk3, risk2, risk1];
    for (const [index, riskFactors] of risks.entries()) {
      const found = body.symptoms.filter(value => riskFactors.includes(value));
      if (found.length > 0) {
        ticket.riskLevel = risks.length - index;
        break;
      }
    }
    const newTicket = await this.create(ticket);
    body.vaccines.forEach(async vaccine => {
      vaccine.ticketId = newTicket.id;
    });
    await this.vaccineRepo.save(body.vaccines);
    return newTicket;
  }
}

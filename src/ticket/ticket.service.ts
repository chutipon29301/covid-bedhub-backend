import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vaccine, Symptom, Ticket, TicketStatus, Officer, Patient } from '@entity';
import { FindConditions, In, Repository } from 'typeorm';
import { CrudService } from '../libs/crud.service';
import { CreateTicketDto, EditTicketDto } from './dto/ticket.dto';
// import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class TicketService extends CrudService<Ticket> {
  constructor(
    @InjectRepository(Patient) private readonly patientRepo: Repository<Patient>,
    @InjectRepository(Officer) private readonly officerRepo: Repository<Officer>,
    @InjectRepository(Vaccine) private readonly vaccineRepo: Repository<Vaccine>,
    @InjectRepository(Ticket) repo: Repository<Ticket>,
  ) {
    super(repo);
  }

  // async checkTicketBelongToRequester(userId: number, patientId): Promise<boolean> {
  //   const patient = await this.patientRepo.findOne({ id: patientId, reporterId: userId });
  //   return patient != null;
  // }

  // async listAllTicketsOfReporter(reporterId: number): Promise<Ticket[]> {
  //   const tickets = await this.repo
  //     .createQueryBuilder('ticket')
  //     .innerJoinAndSelect('ticket.patient', 'patient')
  //     .where('patient.reporterId = :reporterId', { reporterId })
  //     .getMany();
  //   return tickets;
  // }

  // async listAllHospitalTickets(userId: number, ticketStatus: TicketStatus): Promise<Ticket[]> {
  //   const officer = await this.officerRepo.findOne({ id: userId });
  //   if (officer && ticketStatus) {
  //     return await this.repo.find({ where: { hospitalId: officer.hospitalId, status: ticketStatus } });
  //   }
  //   return await this.repo.find({ where: { hospitalId: officer.hospitalId, relation: ['patient'] } });
  // }

  async create(data: CreateTicketDto): Promise<Ticket> {
    const existingTicket = await this.repo.findOne({
      where: {
        patientId: data.patientId,
        status: In([TicketStatus.MATCH, TicketStatus.REQUEST]),
      },
    });
    if (existingTicket) {
      throw new BadRequestException('Patient already create ticket');
    }
    const riskLevel = await this.calculateRiskLevel(data.patientId, data.symptoms);
    const ticket = await super.create({
      ...data,
      riskLevel,
      location: { type: 'Point', coordinates: [data.lat, data.lng] },
    });
    const vaccines: Vaccine[] = [];
    for (const vaccine of data.vaccines) {
      vaccines.push({ ...new Vaccine(), ...vaccine, ticketId: ticket.id });
    }
    await this.vaccineRepo.save(vaccines);
    return ticket;
  }

  async updateTicket(conditions: FindConditions<Ticket>, dto: EditTicketDto): Promise<Ticket> {
    const ticket = await super.updateOne(conditions, dto);
    const riskLevel = await this.calculateRiskLevel(ticket.patientId, ticket.symptoms);
    return super.updateOne(conditions, { riskLevel });
  }

  private async calculateRiskLevel(patientId: number, symptoms: Symptom[]): Promise<number> {
    let riskLevel = 0;
    const risk1 = [Symptom.FEVER, Symptom.COUGH, Symptom.SMELLESS_RASH];
    const risk2 = [Symptom.DIARRHEA, Symptom.TIRED_HEADACHE, Symptom.DIFFICULT_BREATHING, Symptom.ANGINA];
    const risk3 = [Symptom.EXHAUSTED, Symptom.CHEST_PAIN, Symptom.UNCONCIOUS];
    const risks = [risk3, risk2, risk1];
    for (const [index, riskFactors] of risks.entries()) {
      const found = symptoms.filter(value => riskFactors.includes(value));
      if (found.length > 0) {
        riskLevel = risks.length - index;
        break;
      }
    }
    const patient = await this.patientRepo.findOne({ where: { id: patientId } });
    if (patient.illnesses && patient.illnesses.length > 0 && riskLevel < risks.length) {
      riskLevel += 1;
    }
    return riskLevel;
  }
}

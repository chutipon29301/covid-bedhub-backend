import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as DataLoader from 'dataloader';
import { Vaccine, Symptom, Ticket, TicketStatus, Officer, Patient, Hospital } from '@entity';
import { In, Repository } from 'typeorm';
import { CrudService } from '../libs/crud.service';
import { AcceptTicketDto, CreateTicketDto, EditSymptomDto } from './dto/ticket.dto';

@Injectable()
export class TicketService extends CrudService<Ticket> {
  readonly findHospital: DataLoader<number, Hospital>;
  readonly findPatient: DataLoader<number, Patient>;
  readonly findVaccines: DataLoader<number, Vaccine[]>;

  constructor(
    @InjectRepository(Patient) private readonly patientRepo: Repository<Patient>,
    @InjectRepository(Officer) private readonly officerRepo: Repository<Officer>,
    @InjectRepository(Vaccine) private readonly vaccineRepo: Repository<Vaccine>,
    @InjectRepository(Hospital) private readonly hospitalRepo: Repository<Hospital>,
    @InjectRepository(Ticket) repo: Repository<Ticket>,
  ) {
    super(repo);

    this.findHospital = new DataLoader<number, Hospital>(async ids => {
      const hospitals = await this.hospitalRepo.findByIds([...ids]);
      return ids.map(id => hospitals.find(o => o.id === id) || null);
    });

    this.findPatient = new DataLoader<number, Patient>(async ids => {
      const patients = await this.patientRepo.findByIds([...ids]);
      return ids.map(id => patients.find(o => o.id === id) || null);
    });

    this.findVaccines = new DataLoader<number, Vaccine[]>(async ids => {
      const vaccines = await this.vaccineRepo.find({ where: { ticketId: In([...ids]) } });
      return ids.map(id => vaccines.filter(o => o.id === id));
    });
  }

  findReporterTicket(reporterId: number, ticketId: number): Promise<Ticket> {
    return this.repo
      .createQueryBuilder('ticket')
      .leftJoin('ticket.patient', 'patient')
      .where('ticket.id = :ticketId', { ticketId })
      .andWhere('patient.reporterId = :reporterId', { reporterId })
      .getOne();
  }

  async listRequestTicket(userId: number): Promise<Ticket[]> {
    const officer = await this.officerRepo.findOne(userId, {
      relations: ['hospital'],
    });
    const { x: lat, y: lng } = officer.hospital.location;
    const tickets = await this.repo
      .createQueryBuilder('ticket')
      .where(
        `(ticket.location<@>point(:lat,:lng))*1.609344 < 5+30*SQRT(LEAST(48,EXTRACT(EPOCH FROM current_timestamp-ticket."createdAt")/3600))`,
        { lat, lng },
      )
      .andWhere(`ticket.status = :status`, { status: TicketStatus.REQUEST })
      .orderBy('ticket.riskLevel', 'DESC')
      .addOrderBy('ticket."createdAt"', 'ASC')
      .getMany();
    return tickets;
  }

  async findTicketByNationalId(userId: number, nid: string): Promise<Ticket> {
    const officer = await this.officerRepo.findOne({ id: userId });
    const patient = await this.patientRepo.findOne({ where: { identification: nid } });
    const appointmentTicket = await this.repo.findOne({
      where: {
        hospitalId: officer.hospitalId,
        patientId: patient.id,
        status: TicketStatus.MATCH,
      },
      order: { id: 'DESC' },
    });
    if (!appointmentTicket) {
      throw new BadRequestException('Ticket not found');
    }
    return appointmentTicket;
  }

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
      location: {
        x: data.lat,
        y: data.lng,
      },
    });
    const vaccines: Vaccine[] = [];
    for (const vaccine of data.vaccines) {
      vaccines.push({ ...new Vaccine(), ...vaccine, ticketId: ticket.id });
    }
    await this.vaccineRepo.save(vaccines);
    return ticket;
  }

  async updateSymptom(id: number, reporterId: number, data: EditSymptomDto): Promise<Ticket> {
    const ticket = await this.findReporterTicket(reporterId, id);
    if (!ticket) {
      throw new BadRequestException('Ticket not exist');
    }
    if (![TicketStatus.REQUEST, TicketStatus.MATCH].includes(ticket.status)) {
      throw new BadRequestException('Ticket cannot be edit');
    }
    const riskLevel = await this.calculateRiskLevel(ticket.patientId, ticket.symptoms);
    return this.updateOne({ id }, { symptoms: data.symptoms, riskLevel });
  }

  async reporterCancelTicket(id: number, reporterId: number): Promise<Ticket> {
    const ticket = await this.findReporterTicket(reporterId, id);
    if (!ticket) {
      throw new BadRequestException('Ticket not exist');
    }
    return this.updateOne({ id }, { status: TicketStatus.PATIENT_CANCEL });
  }

  async acceptTicket(officerId: number, data: AcceptTicketDto): Promise<Ticket> {
    const ticket = await this.findOne(data.id);
    if (!ticket) {
      throw new BadRequestException('Ticket not exist');
    }
    if (ticket.status !== TicketStatus.REQUEST) {
      throw new BadRequestException('Cannot accept this ticket');
    }
    const officer = await this.officerRepo.findOne(officerId);
    if (!officer) {
      throw new BadRequestException('Officer not exist');
    }
    ticket.status = TicketStatus.MATCH;
    ticket.updatedById = officerId;
    ticket.hospitalId = officer.hospitalId;
    ticket.appointedDate = data.appointedDate;
    return this.repo.save(ticket);
  }

  async cancelAppointment(id: number, officerId: number): Promise<Ticket> {
    const officer = await this.officerRepo.findOne(officerId);
    if (!officer) {
      throw new BadRequestException('Officer not exist');
    }
    const ticket = await this.findOne({
      where: { id, hospitalId: officer.hospitalId },
    });
    if (!ticket) {
      throw new BadRequestException('Ticket not exist');
    }
    if (ticket.status !== TicketStatus.MATCH) {
      throw new BadRequestException('Cannot cancel this ticket appointment');
    }
    ticket.status = TicketStatus.REQUEST;
    ticket.updatedById = null;
    ticket.hospitalId = null;
    ticket.appointedDate = null;
    return this.repo.save(ticket);
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

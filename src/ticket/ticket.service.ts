import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as DataLoader from 'dataloader';
import { Vaccine, Symptom, Ticket, TicketStatus, Officer, Patient, Hospital } from '@entity';
import { CrudService } from '../libs/crud.service';
import {
  AcceptTicketDto,
  AppointmentInfoDto,
  CreateTicketDto,
  EditAppointmentDto,
  EditSymptomDto,
  SortOption,
  TicketByRiskLevelCountDto,
  TicketSortableColumn,
  TicketSortOption,
} from './dto/ticket.dto';

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

  async listRequestTicket(
    officerId: number,
    take: number,
    skip: number,
    riskLevel?: number,
    sortOption?: TicketSortOption,
  ): Promise<[Ticket[], number]> {
    const officer = await this.officerRepo.findOne(officerId, {
      relations: ['hospital'],
    });
    const { x: lat, y: lng } = officer.hospital.location;
    let query = this.repo
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.patient', 'patient')
      .where(`ticket.status = :status`, { status: TicketStatus.REQUEST })
      .andWhere(riskLevel ? `ticket.riskLevel = :riskLevel` : `1=1`, { riskLevel });
    if (!officer.hospital.isPage) {
      query = query.andWhere(
        `(ticket.location<@>point(:lat,:lng))*1.609344 <= 10+40*SQRT(LEAST(48,EXTRACT(EPOCH FROM current_timestamp-ticket."createdAt")/3600))`,
        { lat, lng },
      );
    }
    if (sortOption) {
      switch (sortOption.sortBy) {
        case TicketSortableColumn.RISK_LEVEL:
          query = query.orderBy('ticket.riskLevel', sortOption.sortOption);
          break;
        case TicketSortableColumn.CREATED_AT:
          query = query.orderBy('ticket.createdAt', sortOption.sortOption);
          break;
        case TicketSortableColumn.BIRTH_DATE:
          switch (sortOption.sortOption) {
            case SortOption.ASC:
              query = query.orderBy('patient.birthDate', SortOption.DESC);
              break;
            case SortOption.DESC:
              query = query.orderBy('patient.birthDate', SortOption.ASC);
              break;
          }
          break;
      }
    } else {
      query = query.orderBy('ticket.riskLevel', 'DESC').addOrderBy('ticket.createdAt', 'ASC');
    }
    return query.take(take).skip(skip).getManyAndCount();
  }

  async listAcceptedTicket(
    officerId: number,
    take: number,
    skip: number,
    riskLevel?: number,
    sortOption?: TicketSortOption,
  ): Promise<[Ticket[], number]> {
    const { hospitalId } = await this.officerRepo.findOne(officerId);
    let query = this.repo
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.patient', 'patient')
      .where('ticket.hospitalId = :hospitalId', { hospitalId })
      .andWhere(riskLevel ? `ticket.riskLevel = :riskLevel` : `1=1`, { riskLevel });
    if (sortOption) {
      switch (sortOption.sortBy) {
        case TicketSortableColumn.RISK_LEVEL:
          query = query.orderBy('ticket.riskLevel', sortOption.sortOption);
          break;
        case TicketSortableColumn.CREATED_AT:
          query = query.orderBy('ticket.createdAt', sortOption.sortOption);
          break;
        case TicketSortableColumn.BIRTH_DATE:
          switch (sortOption.sortOption) {
            case SortOption.ASC:
              query = query.orderBy('patient.birthDate', SortOption.DESC);
              break;
            case SortOption.DESC:
              query = query.orderBy('patient.birthDate', SortOption.ASC);
              break;
          }
          break;
      }
    } else {
      query = query.orderBy('ticket.riskLevel', 'DESC').addOrderBy('ticket.createdAt', 'ASC');
    }
    return query.take(take).skip(skip).getManyAndCount();
  }

  async findTicketByNationalId(officerId: number, nid: string): Promise<AppointmentInfoDto> {
    const officer = await this.officerRepo.findOne({ id: officerId });
    const patient = await this.patientRepo.findOne({ where: { identification: nid } });
    if (!patient) {
      return {
        ticket: null,
        hospital: null,
      };
    }
    const [ticket] = await this.repo.find({
      where: {
        patientId: patient.id,
        status: TicketStatus.MATCH,
      },
      relations: ['hospital'],
      order: { createdAt: 'DESC' },
      take: 1,
    });
    if (!ticket) {
      return {
        ticket: null,
        hospital: null,
      };
    }
    if (ticket.hospitalId === officer.hospitalId) {
      return {
        ticket,
        hospital: ticket.hospital,
      };
    } else {
      return {
        ticket: null,
        hospital: ticket.hospital,
      };
    }
  }

  async findTicketForOfficer(officerId: number, ticketId: number): Promise<Ticket> {
    const { hospitalId } = await this.officerRepo.findOne(officerId);
    return this.repo.findOne({ hospitalId, id: ticketId });
  }

  async requestedAndAcceptedTicketCount(officerId: number): Promise<number[]> {
    const officer = await this.officerRepo.findOne(officerId, { relations: ['hospital'] });
    const { x: lat, y: lng } = officer.hospital.location;
    let query = this.repo
      .createQueryBuilder('ticket')
      .where(`ticket.status = :status`, { status: TicketStatus.REQUEST });
    if (!officer.hospital.isPage) {
      query = query.andWhere(
        `(ticket.location<@>point(:lat,:lng))*1.609344 < 10+40*SQRT(LEAST(48,EXTRACT(EPOCH FROM current_timestamp-ticket."createdAt")/3600))`,
        { lat, lng },
      );
    }
    const requestedCount = await query.getCount();
    const acceptedCount = await this.repo.count({ hospitalId: officer.hospitalId });
    return [requestedCount, acceptedCount];
  }

  async requestedTicketByRiskLevelCount(officerId: number): Promise<TicketByRiskLevelCountDto[]> {
    const officer = await this.officerRepo.findOne(officerId, { relations: ['hospital'] });
    const { x: lat, y: lng } = officer.hospital.location;
    let query = this.repo
      .createQueryBuilder('ticket')
      .select(`ticket.riskLevel`, 'riskLevel')
      .addSelect(`COUNT(1)`, 'count')
      .where(`ticket.status = :status`, { status: TicketStatus.REQUEST });
    if (!officer.hospital.isPage) {
      query = query.andWhere(
        `(ticket.location<@>point(:lat,:lng))*1.609344 < 10+40*SQRT(LEAST(48,EXTRACT(EPOCH FROM current_timestamp-ticket."createdAt")/3600))`,
        { lat, lng },
      );
    }
    return query.groupBy(`ticket.riskLevel`).getRawMany();
  }

  async acceptedTicketByRiskLevelCount(officerId: number): Promise<TicketByRiskLevelCountDto[]> {
    const { hospitalId } = await this.officerRepo.findOne(officerId);
    return this.repo
      .createQueryBuilder('ticket')
      .select('ticket.riskLevel', 'riskLevel')
      .addSelect('COUNT(1)', 'count')
      .where('ticket.hospitalId = :hospitalId', { hospitalId })
      .groupBy('ticket.riskLevel')
      .getRawMany();
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
    ticket.notes = data.notes;
    return this.repo.save(ticket);
  }

  async editAppointment(officerId: number, data: EditAppointmentDto): Promise<Ticket> {
    const { id, ...newValue } = data;
    const officer = await this.officerRepo.findOne(officerId);
    if (!officer) {
      throw new BadRequestException('Officer not exist');
    }
    const ticket = await this.findOne({ where: { id, hospitalId: officer.hospitalId } });
    if (!ticket) {
      throw new BadRequestException('Ticket not exist');
    }
    return this.repo.save({ ...ticket, ...newValue });
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

  private async calculateRiskLevel(patientId: number, symptoms?: Symptom[]): Promise<number> {
    let riskLevel = 0;
    const risk1 = [Symptom.FEVER, Symptom.COUGH, Symptom.SMELLESS_RASH];
    const risk2 = [Symptom.DIARRHEA, Symptom.TIRED_HEADACHE, Symptom.DIFFICULT_BREATHING, Symptom.ANGINA];
    const risk3 = [Symptom.EXHAUSTED, Symptom.CHEST_PAIN, Symptom.UNCONCIOUS];
    const risks = [risk3, risk2, risk1];
    if (symptoms) {
      for (const [index, riskFactors] of risks.entries()) {
        const found = symptoms.filter(value => riskFactors.includes(value));
        if (found.length > 0) {
          riskLevel = risks.length - index;
          break;
        }
      }
    }
    const patient = await this.patientRepo.findOne({ where: { id: patientId } });
    if (patient.illnesses && patient.illnesses.length > 0 && riskLevel == 1) {
      riskLevel += 1;
    }
    return riskLevel;
  }
}

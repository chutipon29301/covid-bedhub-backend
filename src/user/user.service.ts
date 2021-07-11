import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hospital } from 'src/entities/Hospital.entity';
import { Repository } from 'typeorm';
import { Officer } from '../entities/Officer.entity';
import { Patient } from '../entities/Patient.entity';
import { CreateOfficerDto } from './dto/create-officer.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Hospital) private readonly hospitalRepo: Repository<Hospital>,
    @InjectRepository(Officer) private readonly officerRepo: Repository<Officer>,
    @InjectRepository(Patient) private readonly patientRepo: Repository<Patient>,
  ) {}

  async ensurePatient(lineId: string): Promise<Patient> {
    const patient = await this.patientRepo.findOne({ where: { lineId }, relations: ['defaultProfile'] });
    if (patient) {
      return patient;
    }
    const newPatient = new Patient();
    newPatient.lineId = lineId;
    return this.patientRepo.create(newPatient);
  }
  async createOfficer(user: CreateOfficerDto): Promise<Officer> {
    try {
      const id = user.hospitalId;
      const hospital = await this.hospitalRepo.findOne({ id });
      if (hospital) {
        const officer = await this.officerRepo.create(user);
        await this.officerRepo.save(officer);
        return officer;
      }
      throw new Error('Hospital not found');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new NotFoundException(error.message);
      }
    }
  }
}

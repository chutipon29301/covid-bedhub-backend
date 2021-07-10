import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Officer } from '../entities/Officer.entity';
import { Patient } from '../entities/Patient.entity';

@Injectable()
export class UserService {
  constructor(
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
}

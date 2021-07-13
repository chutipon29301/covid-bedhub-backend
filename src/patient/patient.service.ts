import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CrudService } from '../libs/crud.service';
import { CreatePatientDto } from './dto/patient.dto';
import { Patient, Reporter } from '@entity';
@Injectable()
export class PatientService extends CrudService<Patient> {
  constructor(
    @InjectRepository(Patient) repo: Repository<Patient>,
    @InjectRepository(Reporter) private readonly reporterRepo: Repository<Reporter>,
  ) {
    super(repo);
  }
  async createPatient(reporterId: number, body: CreatePatientDto): Promise<Patient> {
    const reporter = await this.reporterRepo.findOne({ id: reporterId });
    const patient = await this.create({ ...body, reporterId });
    if (!reporter.defaultPatientId) {
      reporter.defaultPatientId = patient.id;
      await this.reporterRepo.save(reporter);
    }
    return patient;
  }
}

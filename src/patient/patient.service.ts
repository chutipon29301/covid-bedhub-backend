import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CrudService } from '../libs/crud.service';
import { CreatePatientDto } from './dto/patient.dto';
import { Patient, Reporter } from '../entities';
@Injectable()
export class PatientService extends CrudService<Patient> {
  constructor(
    @InjectRepository(Patient) repo: Repository<Patient>,
    @InjectRepository(Reporter) private readonly reporterRepo: Repository<Reporter>,
  ) {
    super(repo);
  }
  public async createOne(body: CreatePatientDto): Promise<Patient> {
    // body.
    const patient = await this.create(body);
    const reporter = await this.reporterRepo.findOne({ id: body.reporterId });
    reporter.defaultPatientId = patient.id;
    await this.reporterRepo.update({ id: body.reporterId }, reporter);
    return patient;
  }
}

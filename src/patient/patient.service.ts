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
    @InjectRepository(Reporter) private readonly profileRepo: Repository<Reporter>,
  ) {
    super(repo);
  }
  public async createOne(body: CreatePatientDto): Promise<Patient> {
    // body.
    const patient = await this.create(body);
    const profile = await this.profileRepo.findOne({ id: body.userId });
    profile.defaultPatientId = patient.id;
    await this.profileRepo.update({ id: body.userId }, profile);
    return patient;
  }
}

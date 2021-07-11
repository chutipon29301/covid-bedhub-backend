import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from '../entities/Profile.entity';
import { Repository } from 'typeorm';
import { Patient } from '../entities/Patient.entity';
import { CrudService } from '../libs/crud.service';
import { CreatePatientDto } from './dto/create-patient.dto';
@Injectable()
export class PatientService extends CrudService<Patient> {
  constructor(
    @InjectRepository(Patient) repo: Repository<Patient>,
    @InjectRepository(Profile) private readonly profileRepo: Repository<Profile>,
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

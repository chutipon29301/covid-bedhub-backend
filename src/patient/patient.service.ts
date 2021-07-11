import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../entities/Patient.entity';
import { CrudService } from '../libs/crud.service';
@Injectable()
export class PatientService extends CrudService<Patient> {
  constructor(@InjectRepository(Patient) repo: Repository<Patient>) {
    super(repo);
  }
}

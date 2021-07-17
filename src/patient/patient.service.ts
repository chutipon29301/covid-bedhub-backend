import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CrudService } from '../libs/crud.service';
import { Patient } from '@entity';

@Injectable()
export class PatientService extends CrudService<Patient> {
  constructor(@InjectRepository(Patient) repo: Repository<Patient>) {
    super(repo);
  }
}

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
}

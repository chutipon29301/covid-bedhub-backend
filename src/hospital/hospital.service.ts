import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hospital } from '../entities/Hospital.entity';
import { CrudService } from '../libs/crud.service';

@Injectable()
export class HospitalService extends CrudService<Hospital> {
  constructor(@InjectRepository(Hospital) repo: Repository<Hospital>) {
    super(repo);
  }
}

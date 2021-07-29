import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CrudService } from '../libs/crud.service';
import { Patient } from '@entity';
import { CreatePatientDto } from './dto/patient.dto';

@Injectable()
export class PatientService extends CrudService<Patient> {
  constructor(@InjectRepository(Patient) repo: Repository<Patient>) {
    super(repo);
  }

  create(data: Partial<Patient>): Promise<Patient> {
    if (!this.checkID(data.identification)) {
      throw new BadRequestException('Invalid Identification Number');
    }
    return super.create(data);
  }

  private async checkID(nid: string): Promise<boolean> {
    if (nid.length === 13 && /^[0-9]\d+$/.test(nid)) {
      const sum = 0;
      for (let i = 0, sum = 0; i < 12; i++) {
        sum += +nid.charAt(i) * (13 - i);
      }
      return (11 - (sum % 11)) % 10 === +nid.charAt(12);
    }
    return /^(?!^0+$)[a-zA-Z0-9]{3,20}$/.test(nid);
  }
}

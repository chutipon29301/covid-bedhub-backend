import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as DataLoader from 'dataloader';

import { Officer, Hospital, AccessCode } from '@entity';
import { CrudService } from '../libs/crud.service';
import { CreateOfficerDto } from './dto/officer.dto';

@Injectable()
export class OfficerService extends CrudService<Officer> {
  readonly findHospital: DataLoader<number, Hospital>;

  constructor(
    @InjectRepository(Officer) repo: Repository<Officer>,
    @InjectRepository(Hospital) private readonly hospitalRepo: Repository<Hospital>,
    @InjectRepository(AccessCode) private readonly accessCodeRepo: Repository<AccessCode>,
  ) {
    super(repo);

    this.findHospital = new DataLoader(async ids => {
      const hospitals = await this.hospitalRepo.findByIds([...ids]);
      return ids.map(id => hospitals.find(o => o.id === id) || null);
    });
  }

  async createOfficer(data: CreateOfficerDto): Promise<Officer> {
    const accessCode = await this.accessCodeRepo.findOne({
      where: { accessCode: data.accessCode },
      relations: ['hospital'],
    });
    if (!accessCode) {
      throw new BadRequestException('Access code not exist');
    }
    return this.create({ ...data, hospitalId: accessCode.hospitalId });
  }
}

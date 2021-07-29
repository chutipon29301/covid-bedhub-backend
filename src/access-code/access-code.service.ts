import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as DataLoader from 'dataloader';
import { Repository } from 'typeorm';
import { AccessCode, Hospital, Officer, UserType } from '../entities';
import { CrudService } from '../libs/crud.service';

@Injectable()
export class AccessCodeService extends CrudService<AccessCode> {
  readonly findHospital: DataLoader<number, Hospital>;

  constructor(
    @InjectRepository(AccessCode) repo: Repository<AccessCode>,
    @InjectRepository(Hospital) private readonly hospitalRepo: Repository<Hospital>,
    @InjectRepository(Officer) private readonly officerRepo: Repository<Officer>,
  ) {
    super(repo);

    this.findHospital = new DataLoader(async ids => {
      const hospitals = await this.hospitalRepo.findByIds([...ids]);
      return ids.map(id => hospitals.find(o => o.id === id) || null);
    });
  }

  async updateCode(officerId: number, userType: UserType, newCode: string): Promise<AccessCode> {
    const { hospitalId } = await this.officerRepo.findOne(officerId);
    const accessCode = await this.findOne({ where: { hospitalId, userType } });
    accessCode.accessCode = newCode;
    return this.save(accessCode);
  }
}

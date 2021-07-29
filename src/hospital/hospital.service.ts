import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { nanoid } from 'nanoid';
import * as DataLoader from 'dataloader';

import { AccessCode, Officer, UserType, Hospital } from '@entity';
import { CrudService } from '../libs/crud.service';
import { CreateHospitalDto } from './dto/hospital.dto';

@Injectable()
export class HospitalService extends CrudService<Hospital> {
  readonly findAccessCode: DataLoader<number, AccessCode[]>;
  constructor(
    @InjectRepository(Officer) private readonly officerRepo: Repository<Officer>,
    @InjectRepository(AccessCode) private readonly accessCodeRepo: Repository<AccessCode>,
    @InjectRepository(Hospital) repo: Repository<Hospital>,
  ) {
    super(repo);

    this.findAccessCode = new DataLoader<number, AccessCode[]>(
      async hospitalIds => {
        const accessCodes = await this.accessCodeRepo.find({
          where: { hospitalId: In([...hospitalIds]) },
        });
        return hospitalIds.map(hospitalId => accessCodes.filter(o => o.hospitalId === hospitalId));
      },
      { cache: false },
    );
  }

  async createOne(body: CreateHospitalDto): Promise<Hospital> {
    const staffAccessCode = new AccessCode();
    const queueAccessCode = new AccessCode();
    staffAccessCode.accessCode = nanoid(6);
    queueAccessCode.accessCode = nanoid(6);
    staffAccessCode.userType = UserType.STAFF;
    queueAccessCode.userType = UserType.QUEUE_MANAGER;
    const hospital = await this.create({
      ...body,
    });
    staffAccessCode.hospitalId = hospital.id;
    queueAccessCode.hospitalId = hospital.id;
    await this.accessCodeRepo.save([staffAccessCode, queueAccessCode]);
    return hospital;
  }

  async findOfficerHospital(userId: number): Promise<Hospital> {
    const officer = await this.officerRepo.findOne({ id: userId });
    return this.repo.findOne({ id: officer.hospitalId });
  }

  async updateCode(officerId: number, userType: UserType, newCode: string): Promise<AccessCode> {
    const { hospitalId } = await this.officerRepo.findOne(officerId);
    const accessCode = await this.accessCodeRepo.findOne({ where: { hospitalId, userType } });
    accessCode.accessCode = newCode;
    return this.accessCodeRepo.save(accessCode);
  }

  async checkAccessCodeValid(accessCode: string): Promise<Hospital> {
    const validCode = await this.accessCodeRepo.findOne({ where: { accessCode } });
    if (!validCode) {
      throw new NotFoundException('Access code not found');
    }
    const hospital = await this.repo.findOne({ where: { id: validCode.hospitalId } });
    return hospital;
  }
}

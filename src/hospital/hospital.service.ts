import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
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

    this.findAccessCode = new DataLoader<number, AccessCode[]>(async hospitalIds => {
      const accessCodes = await this.accessCodeRepo.find({
        where: { hospitalId: In([...hospitalIds]) },
      });
      return hospitalIds.map(hospitalId => accessCodes.filter(o => o.hospitalId === hospitalId));
    });
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

  async updateCode(userId: number, userType: UserType, newCode: string): Promise<Hospital> {
    try {
      const officer = await this.officerRepo.findOne({ id: userId });
      const hospital = await this.repo.findOne({ id: officer.hospitalId });
      if (hospital) {
        const userCode = await this.accessCodeRepo.findOne({ hospitalId: hospital.id, userType });
        userCode.accessCode = newCode;
        await this.accessCodeRepo.update(userCode.id, userCode);
        return hospital;
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new NotFoundException(error.message);
      }
    }
  }
}

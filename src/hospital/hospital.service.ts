import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { nanoid } from 'nanoid';
import * as DataLoader from 'dataloader';

import { AccessCode, Officer, UserType, Hospital, OfficerRole } from '@entity';
import { CrudService } from '../libs/crud.service';
import { CreateHospitalDto, CreateHospitalResponse } from './dto/hospital.dto';

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

  async createOne(data: CreateHospitalDto): Promise<CreateHospitalResponse> {
    const { lat, lng, username, ...body } = data;
    const staffAccessCode = new AccessCode();
    const queueAccessCode = new AccessCode();
    staffAccessCode.accessCode = nanoid(6).toUpperCase();
    queueAccessCode.accessCode = nanoid(6).toUpperCase();
    staffAccessCode.userType = UserType.STAFF;
    queueAccessCode.userType = UserType.QUEUE_MANAGER;
    let location: { x: number; y: number };
    if (lat && lng) {
      location = {
        x: lat,
        y: lng,
      };
    }
    const hospital = await super.create({
      ...body,
      location,
    });
    staffAccessCode.hospitalId = hospital.id;
    queueAccessCode.hospitalId = hospital.id;
    await this.accessCodeRepo.save([staffAccessCode, queueAccessCode]);
    const password = nanoid(10);
    const officer = this.officerRepo.create({
      username,
      password,
      role: OfficerRole.CODE_GENERATOR,
      hospitalId: hospital.id,
    });
    await this.officerRepo.save(officer);
    return { hospital, codeGeneratorPassword: password, codeGeneratorUsername: username };
  }

  async findOfficerHospital(userId: number): Promise<Hospital> {
    const officer = await this.officerRepo.findOne({ id: userId });
    return this.repo.findOne({ id: officer.hospitalId });
  }
}

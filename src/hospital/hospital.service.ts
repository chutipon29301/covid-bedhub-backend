import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessCode, UserType } from '../entities/AccessCode.entity';
import { Repository } from 'typeorm';
import { Hospital } from '../entities/Hospital.entity';
import { CrudService } from '../libs/crud.service';
import { nanoid } from 'nanoid';
import { CreateHospitalDto } from './dto/create-hospital.dto';
@Injectable()
export class HospitalService extends CrudService<Hospital> {
  constructor(
    @InjectRepository(AccessCode) private readonly accessCodeRepo: Repository<AccessCode>,
    @InjectRepository(Hospital) repo: Repository<Hospital>,
  ) {
    super(repo);
  }

  public async createOne(body: CreateHospitalDto): Promise<Hospital> {
    const staffAccessCode = new AccessCode();
    const queueAccessCode = new AccessCode();
    staffAccessCode.accessCode = nanoid(6);
    queueAccessCode.accessCode = nanoid(6);
    staffAccessCode.userType = UserType.STAFF;
    queueAccessCode.userType = UserType.QUEUE_MANAGER;
    const hospital = await this.create(body);
    staffAccessCode.hospitalId = hospital.id;
    queueAccessCode.hospitalId = hospital.id;
    console.log(hospital);
    await this.accessCodeRepo.save([staffAccessCode, queueAccessCode]);
    return hospital;
  }
}

import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessCode, UserType } from '../entities/AccessCode.entity';
import { Repository } from 'typeorm';
import { Hospital } from '../entities/Hospital.entity';
import { CrudService } from '../libs/crud.service';
import { nanoid } from 'nanoid';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateCodeDto } from './dto/update-code.dto';
import { log } from 'console';
import { Officer } from 'src/entities/Officer.entity';
@Injectable()
export class HospitalService extends CrudService<Hospital> {
  constructor(
    @InjectRepository(Officer) private readonly officerRepo: Repository<Officer>,
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
    await this.accessCodeRepo.save([staffAccessCode, queueAccessCode]);
    return hospital;
  }

  public async updateCode(user_id: number, userType: UserType, newCode: string): Promise<Hospital> {
    try {
      const officer = await this.officerRepo.findOne({ id: user_id });
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

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AccessCode, Officer } from '@entity';

@Injectable()
export class InviteService {
  constructor(
    @InjectRepository(Officer) private readonly officerRepo: Repository<Officer>,
    @InjectRepository(AccessCode) private readonly accessCodeRepo: Repository<AccessCode>,
  ) {}
  async checkAccessCodeValid(accessCode: string): Promise<AccessCode> {
    const validCode = await this.accessCodeRepo.findOne({ where: { accessCode } });
    if (validCode) {
      return validCode;
    }
    throw new NotFoundException('Access code not found');
  }
  async findMany(userId: number): Promise<AccessCode[]> {
    const officer = await this.officerRepo.findOne({ where: { id: userId } });
    return await this.accessCodeRepo.find({ where: { hospitalId: officer.hospitalId } });
  }
}

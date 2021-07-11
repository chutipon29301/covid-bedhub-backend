import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessCode } from 'src/entities/AccessCode.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InviteService {
  constructor(@InjectRepository(AccessCode) private readonly accessCodeRepo: Repository<AccessCode>) {}
  async checkAccessCodeValid(accessCode: string): Promise<AccessCode> {
    const validCode = await this.accessCodeRepo.findOne({ where: { accessCode } });
    if (validCode) {
      return validCode;
    }
    throw new Error('Access code not valid');
  }
}

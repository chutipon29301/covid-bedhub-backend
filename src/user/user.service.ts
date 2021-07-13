import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hospital, Reporter, Officer } from '@entity';
import { Repository } from 'typeorm';
import { CreateOfficerDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Hospital) private readonly hospitalRepo: Repository<Hospital>,
    @InjectRepository(Officer) private readonly officerRepo: Repository<Officer>,
    @InjectRepository(Reporter) private readonly reporterRepo: Repository<Reporter>,
  ) {}

  async ensureProfile(lineId: string): Promise<Reporter> {
    const profile = await this.reporterRepo.findOne({ where: { lineId }, relations: ['defaultPatient'] });
    if (profile) {
      return profile;
    }
    const newProfile = new Reporter();
    newProfile.lineId = lineId;
    return this.reporterRepo.create(newProfile);
  }

  async createOfficer(user: CreateOfficerDto): Promise<Officer> {
    try {
      const id = user.hospitalId;
      const hospital = await this.hospitalRepo.findOne({ id });
      if (hospital) {
        const officer = await this.officerRepo.create(user);
        await this.officerRepo.save(officer);
        return officer;
      }
      throw new Error('Hospital not found');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new NotFoundException(error.message);
      }
    }
  }
}

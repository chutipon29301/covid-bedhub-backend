import { Module } from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { HospitalController } from './hospital.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hospital } from '../entities/Hospital.entity';
import { AccessCode } from '../entities/AccessCode.entity';
import { Officer } from '../entities/Officer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hospital, AccessCode, Officer])],
  providers: [HospitalService],
  controllers: [HospitalController],
})
export class HospitalModule {}

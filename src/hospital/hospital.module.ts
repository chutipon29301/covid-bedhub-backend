import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HospitalService } from './hospital.service';
import { HospitalController } from './hospital.controller';
import { Hospital, AccessCode, Officer } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Hospital, AccessCode, Officer])],
  providers: [HospitalService],
  controllers: [HospitalController],
})
export class HospitalModule {}

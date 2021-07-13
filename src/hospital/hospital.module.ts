import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Hospital, AccessCode, Officer } from '@entity';
import { HospitalController } from './hospital.controller';
import { HospitalService } from './hospital.service';
import { HospitalResolver } from './hospital.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Hospital, AccessCode, Officer])],
  providers: [HospitalService, HospitalResolver],
  controllers: [HospitalController],
})
export class HospitalModule {}

import { Module } from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { HospitalController } from './hospital.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hospital } from '../entities/Hospital.entity';
import { AccessCode } from '../entities/AccessCode.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hospital, AccessCode])],
  providers: [HospitalService],
  controllers: [HospitalController],
})
export class HospitalModule {}

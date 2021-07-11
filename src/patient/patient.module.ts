import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { Patient, Profile } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, Profile])],
  providers: [PatientService],
  controllers: [PatientController],
})
export class PatientModule {}

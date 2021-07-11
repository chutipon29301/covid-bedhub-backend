import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from '../entities/Patient.entity';
import { Profile } from '../entities/Profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, Profile])],
  providers: [PatientService],
  controllers: [PatientController],
})
export class PatientModule {}

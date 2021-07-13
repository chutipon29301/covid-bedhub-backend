import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientService } from './patient.service';
import { Patient, Reporter } from '@entity';
import { PatientResolver } from './patient.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, Reporter])],
  providers: [PatientService, PatientResolver],
})
export class PatientModule {}

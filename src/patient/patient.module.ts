import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { Patient, Reporter } from '@entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, Reporter])],
  providers: [PatientService],
  controllers: [PatientController],
})
export class PatientModule {}

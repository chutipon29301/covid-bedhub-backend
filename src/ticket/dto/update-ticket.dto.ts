import { IsString, IsNumber, IsInt, IsArray, IsEnum, IsIn } from 'class-validator';
import { toDate } from 'date-fns';
import { Symptom, TicketStatus } from '../../entities';
import { Vaccine } from '../../entities/Vaccine.entity';

export class UpdatePatientTicketDto {
  @IsInt()
  patientId: number;

  @IsString()
  examReceiveDate: string;

  @IsString()
  examDate: string;

  @IsString()
  symptoms: Symptom[];
}

export class UpdateHospitalTicketDto {
  @IsInt()
  patientId: number;

  @IsIn([TicketStatus.HOSPITAL_CANCEL, TicketStatus.ACCEPTED])
  status: TicketStatus;

  @IsString()
  appointedDate: string;

  @IsString()
  notes: string;

  @IsInt()
  riskLevel: number;
}

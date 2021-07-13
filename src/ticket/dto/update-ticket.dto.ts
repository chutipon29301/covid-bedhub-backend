import { IsString, IsInt, IsIn } from 'class-validator';
import { Symptom, TicketStatus } from '@entity';

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

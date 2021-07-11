import { IsString, IsNumber, IsInt, IsArray, IsEnum } from 'class-validator';
import { toDate } from 'date-fns';
import { Symptom } from 'src/entities';
import { Vaccine } from 'src/entities/Vaccine.entity';

export class UpdateTicketDto {
  @IsInt()
  patientId: number;

  @IsString()
  examReceiveDate: string;

  @IsString()
  examDate: string;

  @IsString()
  symptoms: Symptom[];
}

import { IsString, IsNumber, IsInt, IsArray, IsEnum } from 'class-validator';
import { toDate } from 'date-fns';
import { Symptom } from '../../entities';
import { Vaccine, VaccineName } from '../../entities/Vaccine.entity';

export class CreateTicketDto {
  @IsInt()
  patientId: number;

  @IsString()
  examReceiveDate: string;

  @IsString()
  examDate: string;

  @IsString()
  symptoms: Symptom[];

  @IsArray()
  vaccines: VaccineDto[];
}

export class VaccineDto {
  @IsInt()
  ticketId: number;
  @IsString()
  vaccineReceiveDate: string;
  @IsInt()
  doseNumber: number;
  @IsEnum(VaccineName)
  vaccineName: VaccineName;
}

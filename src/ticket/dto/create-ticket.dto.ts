import { IsString, IsNumber, IsInt, IsArray, IsEnum } from 'class-validator';
import { toDate } from 'date-fns';
import { Symptom } from 'src/entities';
import { Vaccine } from 'src/entities/Vaccine.entity';

export class CreateTicketDto {
  @IsInt()
  patientId: number;

  @IsString()
  examReceiveDate: string;

  @IsString()
  examDate: string;

  @IsString()
  symptom: Symptom[];

  @IsArray()
  vaccines: VaccineDto[];
}

export class VaccineDto {
  @IsString()
  receiveDate: number;
  @IsInt()
  doseNumber: number;
  @IsEnum(Vaccine)
  vaccineName: Vaccine;
}

import { IsString, IsNumber, IsEnum } from 'class-validator';
import { UserType } from '../../entities/AccessCode.entity';
export class CreateHospitalDto {
  @IsString()
  name: string;

  @IsString()
  subDistrict: string;

  @IsString()
  district: string;

  @IsString()
  province: string;

  @IsString()
  zipCode: string;

  @IsString()
  tel: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

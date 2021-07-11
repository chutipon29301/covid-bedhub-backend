import { IsString, IsNumber } from 'class-validator';
export class UpdateHospitalDto {
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

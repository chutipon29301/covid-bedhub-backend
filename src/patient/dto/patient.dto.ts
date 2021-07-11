import { IsString, IsNumber, IsInt } from 'class-validator';

export class CreatePatientDto {
  @IsInt()
  userId: number;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  birthDate: string;

  @IsString()
  identification: string;

  @IsString()
  subDistrict: string;

  @IsString()
  district: string;

  @IsString()
  province: string;

  @IsString()
  zipCode: string;

  @IsString()
  phone: string;

  @IsString()
  sex: string;

  @IsString()
  tel: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

export class UpdatePatientDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  birthDate: string;

  @IsString()
  identification: string;

  @IsString()
  subDistrict: string;

  @IsString()
  district: string;

  @IsString()
  province: string;

  @IsString()
  zipCode: string;

  @IsString()
  phone: string;

  @IsString()
  sex: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

import { IsString, IsNumber } from 'class-validator';
import { ToInt } from 'class-sanitizer';

export class UpdateProfileDto {
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

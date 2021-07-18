import { IsString, IsNumber, IsEnum } from 'class-validator';
import { AccessCode, Hospital, UserType } from '@entity';
import { Field, InputType, PartialType, PickType } from '@nestjs/graphql';
import { OmitPrimaryGeneratedMetadata } from '@entity';
export class UpdateCodeDto {
  @IsEnum(UserType)
  userType: UserType;

  @IsString()
  newCode: string;
}

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

@InputType()
export class CreateHospitalDto extends OmitPrimaryGeneratedMetadata(Hospital, ['location'] as const) {
  @Field()
  lat: number;

  @Field()
  lng: number;
}

@InputType()
export class UpdateAccessCodeDto extends PickType(AccessCode, ['accessCode', 'userType'] as const, InputType) {}

@InputType()
export class EditHospitalDto extends PartialType(OmitPrimaryGeneratedMetadata(Hospital), InputType) {}

import { IsString, IsNumber, IsEnum } from 'class-validator';
import { AccessCode, Hospital, UserType } from '@entity';
import { Field, InputType, IntersectionType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
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
export class CreateHospitalDto extends IntersectionType(
  PickType(Hospital, ['name'] as const),
  PartialType(PickType(Hospital, ['isPage'] as const)),
  InputType,
) {
  @Field({ nullable: true })
  lat: number;

  @Field({ nullable: true })
  lng: number;

  @Field()
  username: string;
}

@InputType()
export class UpdateAccessCodeDto extends PickType(AccessCode, ['accessCode', 'userType'] as const, InputType) {}

@InputType()
export class EditHospitalDto extends PartialType(OmitPrimaryGeneratedMetadata(Hospital), InputType) {}

@ObjectType()
export class CreateHospitalResponse {
  @Field(() => Hospital)
  hospital: Hospital;
  @Field()
  codeGeneratorUsername: string;
  @Field()
  codeGeneratorPassword: string;
}

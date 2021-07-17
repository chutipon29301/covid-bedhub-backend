import { IsString, IsEnum, IsInt } from 'class-validator';
import { OfficerRole } from '@entity';
export class CreateOfficerDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsEnum(OfficerRole)
  role: OfficerRole;

  @IsInt()
  hospitalId: number;
}

import { IsString, IsEnum, IsInt } from 'class-validator';
import { OfficerRole } from '../../entities';
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

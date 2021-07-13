import { IsString, IsInt, IsEnum } from 'class-validator';
import { OfficerRole } from '../../entities/Officer.entity';

export class UpdateOfficerDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsEnum(OfficerRole)
  role: OfficerRole;

  @IsInt()
  hospitalId: number;

  @IsString()
  employeeCode: string;
}

import { IsString, IsInt, IsEnum } from 'class-validator';
import { Officer, OfficerRole } from '@entity';
import { InputType, PickType } from '@nestjs/graphql';

// export class UpdateOfficerDto {
//   @IsString()
//   username: string;

//   @IsString()
//   password: string;

//   @IsEnum(OfficerRole)
//   role: OfficerRole;

//   @IsInt()
//   hospitalId: number;

//   @IsString()
//   employeeCode: string;
// }

@InputType()
export class UpdateOfficerDto extends PickType(Officer, ['username', 'password', 'employeeCode'] as const, InputType) {}

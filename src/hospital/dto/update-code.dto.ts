import { IsString, IsNumber, IsEnum } from 'class-validator';
import { UserType } from '../../entities/AccessCode.entity';
export class UpdateCodeDto {
  @IsEnum(UserType)
  userType: UserType;
  @IsString()
  newCode: string;
}

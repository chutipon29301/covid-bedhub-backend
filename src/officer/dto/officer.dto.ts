import { Officer } from '@entity';
import { Field, InputType, PickType } from '@nestjs/graphql';

@InputType()
export class UpdateOfficerDto extends PickType(Officer, ['username', 'password', 'employeeCode'] as const, InputType) {}

@InputType()
export class CreateOfficerDto extends PickType(
  Officer,
  ['username', 'password', 'firstName', 'lastName', 'employeeId'] as const,
  InputType,
) {
  @Field()
  accessCode: string;
}

import { Officer } from '@entity';
import { Field, InputType, PickType } from '@nestjs/graphql';

@InputType()
export class UpdateOfficerDto extends PickType(Officer, ['username', 'employeeCode'] as const, InputType) {
  @Field()
  password: string;
}

@InputType()
export class CreateOfficerDto extends PickType(
  Officer,
  ['username', 'firstName', 'lastName', 'employeeId'] as const,
  InputType,
) {
  @Field()
  accessCode: string;
  @Field()
  password: string;
}

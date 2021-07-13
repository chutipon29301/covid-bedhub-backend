import { Field, ObjectType } from '@nestjs/graphql';

export type AccountType = 'reporter' | 'staff' | 'queue_manager' | 'code_generator';

export interface JwtPayload {
  id: number;
  accountType: AccountType;
  hasProfile?: boolean;
}

@ObjectType()
export class JwtTokenInfo {
  @Field()
  token: string;
  @Field()
  expireDate: Date;
}

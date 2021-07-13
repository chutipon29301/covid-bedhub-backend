import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PingResponseDto {
  @Field()
  msg: string;
}

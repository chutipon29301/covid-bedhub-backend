import { ConfigService as NestConfigService } from '@nestjs/config';
import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Env } from '../config';

export class ConfigService extends NestConfigService<Env> {}

@ObjectType()
export class PointObjectType {
  @Field()
  type: string;

  @Field(() => [Float])
  coordinates: number[];
}

import { ConfigService as NestConfigService } from '@nestjs/config';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Env } from '../config';

export class ConfigService extends NestConfigService<Env> {}

@InputType('PointInput')
@ObjectType()
export class Point {
  @Field()
  x: number;

  @Field()
  y: number;
}

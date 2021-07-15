import { ConfigService as NestConfigService } from '@nestjs/config';
import { Field, ObjectType } from '@nestjs/graphql';
import { Env } from '../config';

export class ConfigService extends NestConfigService<Env> {}

@ObjectType()
export class Point {
  @Field()
  x: number;

  @Field()
  y: number;
}

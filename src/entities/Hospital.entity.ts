import { Column, Entity, OneToMany } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

import { AccessCode, Officer, Ticket } from '.';
import { PrimaryGeneratedEntity } from './PrimaryGenerated.abstract';
import { Point } from '../types';

@ObjectType()
@Entity()
export class Hospital extends PrimaryGeneratedEntity {
  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  subDistrict: string;

  @Field()
  @Column()
  district: string;

  @Field()
  @Column()
  province: string;

  @Field()
  @Column()
  zipCode: string;

  @Field()
  @Column()
  tel: string;

  @Field(() => Point)
  @Column({
    type: 'point',
    transformer: {
      from: v => v,
      to: v => `${v.x},${v.y}`,
    },
  })
  location: Point;

  @OneToMany(() => AccessCode, o => o.hospital)
  accessCodes?: AccessCode[];

  @OneToMany(() => Ticket, o => o.hospital)
  tickets?: Ticket[];

  @OneToMany(() => Officer, o => o.hospital)
  officers?: Officer[];
}

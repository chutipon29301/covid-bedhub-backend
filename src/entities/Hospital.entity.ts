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

  @Field({ nullable: true })
  @Column({ nullable: true })
  subDistrict: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  district: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  province: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  zipCode: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  tel: string;

  @Field(() => Point, { nullable: true })
  @Column({
    type: 'point',
    transformer: {
      from: v => v,
      to: v => (v ? `${v.x},${v.y}` : undefined),
    },
    nullable: true,
  })
  location: Point;

  @OneToMany(() => AccessCode, o => o.hospital)
  accessCodes?: AccessCode[];

  @OneToMany(() => Ticket, o => o.hospital)
  tickets?: Ticket[];

  @OneToMany(() => Officer, o => o.hospital)
  officers?: Officer[];

  @Field()
  @Column({ default: false })
  isPage: boolean;

  @Field()
  @Column({ default: true })
  isActive: boolean;
}

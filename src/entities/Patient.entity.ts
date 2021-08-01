import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { PrimaryGeneratedEntity } from './PrimaryGenerated.abstract';
import { Ticket } from './Ticket.entity';
import { Reporter } from './Reporter.entity';
import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum Illness {
  NCDs = 'NCDs', // โรคทางเดินหายใจเรื้อรัง
  CARDIOVASCULAR = 'CARDIOVASCULAR', // โรคหัวใจและหลอดเลือด
  CKD = 'CKD', // โรคไตวายเรื้อรัง
  STROKE = 'STROKE', //โรคหลอดเลือดสมอง
  OBESITY = 'OBESITY', //โรคอ้วน
  CANCER = 'CANCER', //โรคมะเร็ง
  DIABETES = 'DIABETES', //โรคเบาหวาน
}
registerEnumType(Illness, { name: 'Illness' });

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}
registerEnumType(Gender, { name: 'Gender' });

@ObjectType()
@Entity()
export class Patient extends PrimaryGeneratedEntity {
  @Field(() => Int)
  @Column('int')
  reporterId: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column('date')
  birthDate: string;

  @Field()
  @Column({ unique: true })
  identification: string;

  @Field()
  @Column()
  tel: string;

  @Field(() => Gender)
  @Column({
    type: 'enum',
    enum: Gender,
  })
  sex: Gender;

  @Field(() => [Illness])
  @Column({
    type: 'enum',
    enum: Illness,
    array: true,
    default: [],
  })
  illnesses?: Illness[];

  @ManyToOne(() => Reporter, o => o.patients)
  @JoinColumn({ name: 'reporterId', referencedColumnName: 'id' })
  reporter?: Reporter;

  @OneToMany(() => Ticket, o => o.patient)
  tickets?: Ticket[];
}

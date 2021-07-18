import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Point } from '../types';
import { Hospital } from './Hospital.entity';
import { Officer } from './Officer.entity';
import { Patient } from './Patient.entity';
import { PrimaryGeneratedEntity } from './PrimaryGenerated.abstract';
import { Vaccine } from './Vaccine.entity';

export enum TicketStatus {
  REQUEST = 'REQUEST', // Patient create ticket
  MATCH = 'MATCH', // Hospital accept
  HOSPITAL_CANCEL = 'HOSPITAL_CANCEL',
  PATIENT_CANCEL = 'PATIENT_CANCEL',
}
registerEnumType(TicketStatus, { name: 'TicketStatus' });

export enum Symptom {
  FEVER = 'FEVER', // 1
  COUGH = 'COUGH', // 1
  SMELLESS_RASH = 'SMELLESS_RASH', // 1
  DIARRHEA = 'DIARRHEA', //2
  TIRED_HEADACHE = 'TIRED_HEADACHE', //2
  DIFFICULT_BREATHING = 'DIFFICULT_BREATHING', //2
  ANGINA = 'ANGINA', //2
  EXHAUSTED = 'EXHAUSTED', //3
  CHEST_PAIN = 'CHEST_PAIN', //3
  UNCONCIOUS = 'UNCONCIOUS', //3
}
registerEnumType(Symptom, { name: 'Symptom' });

@ObjectType()
@Entity()
export class Ticket extends PrimaryGeneratedEntity {
  @Field()
  @Column()
  patientId: number;

  @Field()
  @Column('date')
  examReceiveDate: string;

  @Field()
  @Column('date')
  examDate: string;

  @Field()
  @Column()
  examLocation: string;

  @Field(() => [Symptom])
  @Column({
    type: 'enum',
    enum: Symptom,
    array: true,
  })
  symptoms: Symptom[];

  @Field(() => TicketStatus)
  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.REQUEST,
  })
  status: TicketStatus;

  @Field({ nullable: true })
  @Column({
    type: 'date',
    nullable: true,
  })
  appointedDate?: string;

  @Field()
  @Column({
    nullable: true,
  })
  notes?: string;

  @Field(() => Int)
  @Column('int')
  riskLevel: number;

  @Field(() => Point)
  @Column({
    type: 'point',
    transformer: {
      from: v => v,
      to: v => `${v.x},${v.y}`,
    },
  })
  location: Point;

  @Field()
  @Column({
    nullable: true,
  })
  hospitalId?: number;

  @Field()
  @Column({
    nullable: true,
  })
  updatedById?: number;

  @OneToMany(() => Vaccine, o => o.ticket)
  vaccines?: Vaccine[];

  @ManyToOne(() => Patient, o => o.tickets)
  @JoinColumn({ name: 'patientId', referencedColumnName: 'id' })
  patient?: Patient;

  @ManyToOne(() => Hospital, o => o.tickets)
  @JoinColumn({ name: 'hospitalId', referencedColumnName: 'id' })
  hospital?: Hospital;

  @ManyToOne(() => Officer, o => o.editedTickets)
  @JoinColumn({ name: 'updatedById', referencedColumnName: 'id' })
  updatedBy?: Officer;
}

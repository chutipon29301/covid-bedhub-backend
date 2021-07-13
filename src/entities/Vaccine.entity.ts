import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Ticket } from './Ticket.entity';
import { Hospital } from './Hospital.entity';
import { Officer } from './Officer.entity';
import { PrimaryGeneratedEntity } from './PrimaryGenerated.abstract';
import { Field, Int, ObjectType } from '@nestjs/graphql';

export enum VaccineName {
  ASTRAZENECA = 'Astrazeneca',
  SINOVAC = 'Sinovac',
  SINOPHARM = 'Sinopharm',
  PFIZER = 'Pfizer',
}
@ObjectType()
@Entity()
export class Vaccine extends PrimaryGeneratedEntity {
  @Column()
  ticketId: number;

  @Field()
  @Column('date')
  vaccineReceiveDate: string;

  @Field(() => Int)
  @Column('int')
  doseNumber: number;

  @Field(() => VaccineName)
  @Column({
    type: 'enum',
    enum: VaccineName,
  })
  vaccineName: VaccineName;

  @ManyToOne(() => Ticket, o => o.vaccines)
  @JoinColumn({ name: 'ticketId', referencedColumnName: 'id' })
  ticket?: Ticket;
}

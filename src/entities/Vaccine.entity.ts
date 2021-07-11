import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Ticket } from './Ticket.entity';
import { Hospital } from './Hospital.entity';
import { Officer } from './Officer.entity';
import { PrimaryGeneratedEntity } from './PrimaryGenerated.abstract';

export enum VaccineName {
  ASTRAZENECA = 'Astrazeneca',
  SINOVAC = 'Sinovac',
  SINOPHARM = 'Sinopharm',
  PFIZER = 'Pfizer',
}

@Entity()
export class Vaccine extends PrimaryGeneratedEntity {
  @Column()
  ticketId: number;

  @Column('date')
  vaccineReceiveDate: string;

  @Column('date')
  examDate: string;

  @Column('int')
  doseNumber: number;

  @Column({
    type: 'enum',
    enum: VaccineName,
  })
  vaccineName: VaccineName;

  @ManyToOne(() => Ticket, o => o.vaccines)
  @JoinColumn({ name: 'ticketId', referencedColumnName: 'id' })
  ticket?: Ticket;
}

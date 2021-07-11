import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Hospital } from './Hospital.entity';
import { Officer } from './Officer.entity';
import { Patient } from './Patient.entity';
import { PrimaryGeneratedEntity } from './PrimaryGenerated.abstract';

export enum TicketStatus {
  REQUEST = 'REQUEST', // Patient create ticket
  MATCH = 'MATCH', // Hospital accept
  ACCEPTED = 'ACCEPTED', // Patient accept
  HOSPITAL_CANCEL = 'HOSPITAL_CANCEL',
  PATIENT_CANCEL = 'PATIENT_CANCEL',
}

@Entity()
export class Ticket extends PrimaryGeneratedEntity {
  @Column()
  profileId: number;

  @Column('date')
  examReceiveDate: string;

  @Column('date')
  examDate: string;

  @Column()
  symptom: string;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.REQUEST,
  })
  status: TicketStatus;

  @Column({
    type: 'date',
    nullable: true,
  })
  appointedDate?: string;

  @Column({
    nullable: true,
  })
  hospitalId?: number;

  @Column({
    nullable: true,
  })
  updatedById?: number;

  @ManyToOne(() => Patient, o => o.tickets)
  @JoinColumn({ name: 'profileId', referencedColumnName: 'id' })
  patient?: Patient;

  @ManyToOne(() => Hospital, o => o.tickets)
  @JoinColumn({ name: 'hospitalId', referencedColumnName: 'id' })
  hospital?: Hospital;

  @ManyToOne(() => Officer, o => o.editedTickets)
  @JoinColumn({ name: 'updatedById', referencedColumnName: 'id' })
  updatedBy?: Officer;
}

import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { Hospital } from './Hospital.entity';
import { Officer } from './Officer.entity';
import { PrimaryGeneratedEntity } from './PrimaryGenerated.abstract';
import { Profile } from './Profile.entity';

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

  @ManyToOne(() => Profile, o => o.tickets)
  @JoinColumn({ name: 'profileId', referencedColumnName: 'id' })
  profile?: Profile;

  @ManyToOne(() => Hospital, o => o.tickets)
  @JoinColumn({ name: 'hospitalId', referencedColumnName: 'id' })
  hospital?: Hospital;

  @ManyToOne(() => Officer, o => o.editedTickets)
  @JoinColumn({ name: 'updatedById', referencedColumnName: 'id' })
  updatedBy?: Officer;
}

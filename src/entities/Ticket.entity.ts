import { Point } from 'geojson';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Hospital } from './Hospital.entity';
import { Officer } from './Officer.entity';
import { Patient } from './Patient.entity';
import { PrimaryGeneratedEntity } from './PrimaryGenerated.abstract';
import { Vaccine } from './Vaccine.entity';

export enum TicketStatus {
  REQUEST = 'REQUEST', // Patient create ticket
  MATCH = 'MATCH', // Hospital accept
  ACCEPTED = 'ACCEPTED', // Patient accept
  HOSPITAL_CANCEL = 'HOSPITAL_CANCEL',
  PATIENT_CANCEL = 'PATIENT_CANCEL',
}

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
@Entity()
export class Ticket extends PrimaryGeneratedEntity {
  @Column()
  patientId: number;

  @Column('date')
  examReceiveDate: string;

  @Column('date')
  examDate: string;

  @Column({
    type: 'enum',
    enum: Symptom,
    array: true,
  })
  symptoms: Symptom[];

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
  notes?: string;

  @Column('int')
  riskLevel: number;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  location: Point;

  @Column({
    nullable: true,
  })
  hospitalId?: number;

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

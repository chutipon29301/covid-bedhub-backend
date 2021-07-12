import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { PrimaryGeneratedEntity } from './PrimaryGenerated.abstract';
import { Ticket } from './Ticket.entity';
import { Profile } from './Profile.entity';

export enum Illness {
  NCDs = 'NCDs', // โรคทางเดินหายใจเรื้อรัง
  CARDIOVASCULAR = 'CARDIOVASCULAR', // โรคหัวใจและหลอดเลือด
  CKD = 'CKD', // โรคไตวายเรื้อรัง
  STROKE = 'STROKE', //โรคหลอดเลือดสมอง
  OBESITY = 'OBESITY', //โรคอ้วน
  CANCER = 'CANCER', //โรคมะเร็ง
  DIABETES = 'DIABETES', //โรคเบาหวาน
}

@Entity()
export class Patient extends PrimaryGeneratedEntity {
  @Column('int')
  userId: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column('date')
  birthDate: string;

  @Column()
  identification: string;

  @Column()
  subDistrict: string;

  @Column()
  district: string;

  @Column()
  province: string;

  @Column()
  zipCode: string;

  @Column()
  tel: string;

  @Column()
  sex: string;

  @Column({
    type: 'enum',
    enum: Illness,
    array: true,
    nullable: true,
  })
  illnesses: string[];

  @Column('numeric')
  lat: number;

  @Column('numeric')
  lng: number;

  @ManyToOne(() => Profile, o => o.patients)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user?: Profile;

  @OneToMany(() => Ticket, o => o.patient)
  tickets?: Ticket[];

  @OneToOne(() => Profile, o => o.defaultPatient, { nullable: true })
  profile?: Profile;
}

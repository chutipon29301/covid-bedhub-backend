import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { PrimaryGeneratedEntity } from './PrimaryGenerated.abstract';
import { Ticket } from './Ticket.entity';
import { Patient } from './Patient.entity';

@Entity()
export class Profile extends PrimaryGeneratedEntity {
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
  phone: string;

  @Column()
  sex: string;

  @ManyToOne(() => Patient, o => o.profiles)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user?: Patient;

  @OneToMany(() => Ticket, o => o.profile)
  tickets?: Ticket[];

  @OneToOne(() => Patient, o => o.defaultProfile, { nullable: true })
  patient?: Patient;
}

import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { PrimaryGeneratedEntity } from './PrimaryGenerated.abstract';
import { Patient } from './Patient.entity';

@Entity()
export class Profile extends PrimaryGeneratedEntity {
  @Column()
  lineId: string;

  @Column({ nullable: true })
  defaultPatientId: number;

  @OneToMany(() => Patient, o => o.profile)
  patients?: Patient[];

  @OneToOne(() => Patient, o => o.defaultProfile, { nullable: true })
  @JoinColumn({ name: 'defaultPatientId', referencedColumnName: 'id' })
  defaultPatient: Patient;
}

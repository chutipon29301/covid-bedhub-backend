import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { PrimaryGeneratedEntity } from './PrimaryGenerated.abstract';
import { Patient } from './Patient.entity';

@Entity()
export class Profile extends PrimaryGeneratedEntity {
  @Column()
  lineId: string;

  @Column()
  defaultPatientId: number;

  @OneToMany(() => Patient, o => o.user)
  patients?: Patient[];

  @OneToOne(() => Patient, o => o.profile, { nullable: true })
  @JoinColumn({ name: 'defaultPatientId', referencedColumnName: 'id' })
  defaultPatient: Patient;
}

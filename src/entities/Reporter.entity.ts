import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { PrimaryGeneratedEntity } from './PrimaryGenerated.abstract';
import { Patient } from './Patient.entity';
import { Field, ObjectType } from '@nestjs/graphql';
@ObjectType()
@Entity()
export class Reporter extends PrimaryGeneratedEntity {
  @Column()
  lineId: string;

  @Column({ nullable: true })
  defaultPatientId?: number;

  @OneToMany(() => Patient, o => o.reporter)
  patients?: Patient[];

  @OneToOne(() => Patient, o => o.defaultReporter, { nullable: true })
  @JoinColumn({ name: 'defaultPatientId', referencedColumnName: 'id' })
  defaultPatient: Patient;
}

import { Column, Entity, OneToMany } from 'typeorm';
import { PrimaryGeneratedEntity } from './PrimaryGenerated.abstract';
import { Patient } from './Patient.entity';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Reporter extends PrimaryGeneratedEntity {
  @Column()
  lineId: string;

  @OneToMany(() => Patient, o => o.reporter)
  patients?: Patient[];
}

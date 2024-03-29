import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { PrimaryGeneratedEntity } from './PrimaryGenerated.abstract';
import { hashSync } from 'bcrypt';
import { Hospital } from './Hospital.entity';
import { Ticket } from './Ticket.entity';
import { Field, ObjectType } from '@nestjs/graphql';

export enum OfficerRole {
  CODE_GENERATOR = 'CODE_GENERATOR',
  QUEUE_MANAGER = 'QUEUE_MANAGER',
  STAFF = 'STAFF',
  SUPER_ADMIN = 'SUPER_ADMIN',
}
@ObjectType()
@Entity()
export class Officer extends PrimaryGeneratedEntity {
  @Field()
  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  lastName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  employeeId?: string;

  @Field()
  @Column({ type: 'enum', enum: OfficerRole })
  role: OfficerRole;

  @Column()
  hospitalId: number;

  @Field()
  @Column({ nullable: true })
  employeeCode: string;

  @ManyToOne(() => Hospital, o => o.officers)
  @JoinColumn({ name: 'hospitalId', referencedColumnName: 'id' })
  hospital?: Hospital;

  @OneToMany(() => Ticket, o => o.updatedBy)
  editedTickets?: Ticket[];

  @BeforeInsert()
  updatePasswordHash() {
    this.password = hashSync(this.password, 10);
  }
}

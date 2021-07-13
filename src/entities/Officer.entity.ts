import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { PrimaryGeneratedEntity } from './PrimaryGenerated.abstract';
import { hashSync } from 'bcrypt';
import { Hospital } from './Hospital.entity';
import { Ticket } from './Ticket.entity';

export enum OfficerRole {
  CODE_GENERATOR = 'CODE_GENERATOR',
  QUEUE_MANAGER = 'QUEUE_MANAGER',
  STAFF = 'STAFF',
}

@Entity()
export class Officer extends PrimaryGeneratedEntity {
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: OfficerRole })
  role: OfficerRole;

  @Column()
  hospitalId: number;

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

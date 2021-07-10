import { Column, Entity, OneToMany } from 'typeorm';
import { Officer } from './Officer.entity';
import { PrimaryGeneratedEntity } from './PrimaryGenerated.abstract';
import { Ticket } from './Ticket.entity';

@Entity()
export class Hospital extends PrimaryGeneratedEntity {
  @Column()
  name: string;

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

  @Column('numeric')
  lat: number;

  @Column('numeric')
  lng: number;

  @Column({ unique: true })
  queueAccessCode: string;

  @Column({ unique: true })
  staffAccessCode: string;

  @OneToMany(() => Ticket, o => o.hospital)
  tickets?: Ticket[];

  @OneToMany(() => Officer, o => o.hospital)
  officers?: Officer[];
}

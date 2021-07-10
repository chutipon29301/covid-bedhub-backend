import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { PrimaryGeneratedEntity } from './PrimaryGenerated.abstract';
import { Profile } from './Profile.entity';

@Entity()
export class Patient extends PrimaryGeneratedEntity {
  @Column()
  lineId: string;

  @Column()
  defaultProfileId: number;

  @OneToMany(() => Profile, o => o.user)
  profiles?: Profile[];

  @OneToOne(() => Profile, o => o.patient)
  @JoinColumn({ name: 'defaultProfileId', referencedColumnName: 'id' })
  defaultProfile: Profile;
}

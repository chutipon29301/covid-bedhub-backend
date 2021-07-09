import { Column, Entity, OneToMany } from 'typeorm';
import { PrimaryGeneratedEntity } from './PrimaryGenerated.abstract';
import { Profile } from './Profile.entity';

@Entity()
export class Patient extends PrimaryGeneratedEntity {
  @Column()
  lineUserToken: string;

  @OneToMany(() => Profile, o => o.user)
  profiles?: Profile[];
}

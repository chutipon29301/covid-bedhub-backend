import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Hospital } from './Hospital.entity';
import { PrimaryGeneratedEntity } from './PrimaryGenerated.abstract';

export enum UserType {
  STAFF = 'STAFF', // Hospital staff
  QUEUE_MANAGER = 'QUEUE_MANAGER', // Queue manager
}

@ObjectType()
@Entity()
export class AccessCode extends PrimaryGeneratedEntity {
  @Field()
  @Column({ unique: true })
  accessCode: string;

  @Column({
    nullable: false,
  })
  hospitalId?: number;

  @Field()
  @Column({
    type: 'enum',
    enum: UserType,
  })
  userType: UserType;

  @ManyToOne(() => Hospital, o => o.accessCodes)
  @JoinColumn({ name: 'hospitalId', referencedColumnName: 'id' })
  hospital?: Hospital;
}

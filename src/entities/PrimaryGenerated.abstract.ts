import { Type } from '@nestjs/common';
import { Field, ID, ObjectType, OmitType } from '@nestjs/graphql';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
export class PrimaryGeneratedEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}

export function OmitPrimaryGeneratedMetadata<
  T extends PrimaryGeneratedEntity,
  K extends keyof Omit<T, keyof PrimaryGeneratedEntity>,
>(classRef: Type<T>, keys: readonly K[] = []) {
  const entityKeys: (keyof PrimaryGeneratedEntity)[] = ['id', 'createdAt', 'updatedAt'];
  return OmitType(classRef, [...entityKeys, ...keys] as const);
}

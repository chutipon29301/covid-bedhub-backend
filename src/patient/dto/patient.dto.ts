import { Patient } from '@entity';
import { InputType, PartialType } from '@nestjs/graphql';
import { OmitPrimaryGeneratedMetadata } from 'src/entities/PrimaryGenerated.abstract';

@InputType()
export class CreatePatientDto extends PartialType(
  OmitPrimaryGeneratedMetadata(Patient, ['reporterId'] as const),
  InputType,
) {}

@InputType()
export class UpdatePatientDto extends PartialType(
  OmitPrimaryGeneratedMetadata(Patient, ['reporterId', 'identification'] as const),
  InputType,
) {}

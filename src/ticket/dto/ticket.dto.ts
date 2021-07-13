import { Field, InputType, PickType } from '@nestjs/graphql';
import { Ticket, Vaccine } from '@entity';

@InputType()
class CreateVaccine extends PickType(
  Vaccine,
  ['vaccineReceiveDate', 'vaccineName', 'doseNumber'] as const,
  InputType,
) {}

@InputType()
export class CreateTicketDto extends PickType(
  Ticket,
  ['patientId', 'examReceiveDate', 'examDate', 'symptoms'] as const,
  InputType,
) {
  @Field(() => [CreateVaccine], { nullable: true })
  vaccines: CreateVaccine[];

  @Field()
  lat: number;

  @Field()
  lng: number;
}

@InputType()
export class EditTicketDto extends PickType(Ticket, ['symptoms'] as const, InputType) {}
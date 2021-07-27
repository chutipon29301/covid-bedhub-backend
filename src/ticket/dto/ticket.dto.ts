import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
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
  ['patientId', 'examReceiveDate', 'examDate', 'symptoms', 'examLocation'] as const,
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
export class EditSymptomDto extends PickType(Ticket, ['symptoms'] as const, InputType) {}

@InputType()
export class AcceptTicketDto extends PickType(Ticket, ['id', 'appointedDate', 'notes'] as const, InputType) {}

@InputType()
export class EditAppointmentDto extends PickType(Ticket, ['id', 'appointedDate', 'notes'] as const, InputType) {}

@InputType()
export class RequestTicketQueryDto {
  @Field({ defaultValue: 10 })
  take: number;

  @Field({ defaultValue: 0 })
  skip: number;

  @Field({ nullable: true })
  riskLevel: number;
}

@ObjectType()
export class TicketPaginationDto {
  @Field(() => [Ticket])
  tickets: Ticket[];

  @Field()
  count: number;
}

@ObjectType()
export class RequestedAndAcceptedTicketCountDto {
  @Field()
  requestedCount: number;

  @Field()
  acceptedCount: number;
}

@ObjectType()
export class TicketByRiskLevelCountDto {
  @Field()
  riskLevel: number;

  @Field()
  count: number;
}

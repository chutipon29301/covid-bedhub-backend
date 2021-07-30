import { Hospital } from '@entity';
import { ObjectType, PickType } from '@nestjs/graphql';

@ObjectType()
export class AccessCodeHospital extends PickType(Hospital, ['name', 'tel'] as const) {}

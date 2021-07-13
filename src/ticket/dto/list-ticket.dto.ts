import { IsString, IsNumber, IsInt, IsArray, IsEnum } from 'class-validator';
import { toDate } from 'date-fns';
import { Symptom, TicketStatus } from '../../entities';
import { Vaccine } from '../../entities/Vaccine.entity';

export class QueryTicketDto {
  @IsEnum(TicketStatus)
  ticketStatus: TicketStatus;
}


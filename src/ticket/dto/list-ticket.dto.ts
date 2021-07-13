import { IsEnum } from 'class-validator';
import { TicketStatus } from '@entity';

export class QueryTicketDto {
  @IsEnum(TicketStatus)
  ticketStatus: TicketStatus;
}

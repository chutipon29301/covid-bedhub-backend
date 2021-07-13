import { IsEnum } from 'class-validator';
import { TicketStatus } from '../../entities';

export class QueryTicketDto {
  @IsEnum(TicketStatus)
  ticketStatus: TicketStatus;
}

import { IsString } from 'class-validator';
export class CheckTicketDto {
  @IsString()
  nid: string;
}

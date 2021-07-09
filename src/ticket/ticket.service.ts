import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../entities/Ticket.entity';
import { CrudService } from '../libs/crud.service';

@Injectable()
export class TicketService extends CrudService<Ticket> {
  constructor(@InjectRepository(Ticket) repo: Repository<Ticket>) {
    super(repo);
  }
}

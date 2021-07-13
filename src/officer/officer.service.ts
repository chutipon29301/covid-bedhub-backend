import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudService } from '../libs/crud.service';
import { Repository } from 'typeorm';

import { Officer } from '@entity';

@Injectable()
export class OfficerService extends CrudService<Officer> {
  constructor(@InjectRepository(Officer) repo: Repository<Officer>) {
    super(repo);
  }
}

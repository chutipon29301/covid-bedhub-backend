import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../entities/Profile.entity';
import { CrudService } from '../libs/crud.service';
import { CreateProfileDto } from './dto/create-profile.dto';

@Injectable()
export class ProfileService extends CrudService<Profile> {
  constructor(@InjectRepository(Profile) repo: Repository<Profile>) {
    super(repo);
  }
}

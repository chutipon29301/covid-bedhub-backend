import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Officer } from '../entities/Officer.entity';
import { Patient } from '../entities/Patient.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Officer, Patient])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hospital } from '../entities/Hospital.entity';
import { Officer } from '../entities/Officer.entity';
import { Profile } from '../entities/Profile.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Officer, Profile, Hospital])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

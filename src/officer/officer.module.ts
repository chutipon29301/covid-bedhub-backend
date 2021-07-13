import { Module } from '@nestjs/common';
import { OfficerService } from './officer.service';
import { OfficerController } from './officer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Officer } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Officer])],
  providers: [OfficerService],
  controllers: [OfficerController],
})
export class OfficerModule {}

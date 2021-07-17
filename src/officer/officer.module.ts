import { Module } from '@nestjs/common';
import { OfficerService } from './officer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessCode, Hospital, Officer } from '@entity';
import { OfficerResolver } from './officer.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Officer, Hospital, AccessCode])],
  providers: [OfficerService, OfficerResolver],
})
export class OfficerModule {}

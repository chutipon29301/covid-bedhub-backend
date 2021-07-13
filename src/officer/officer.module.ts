import { Module } from '@nestjs/common';
import { OfficerService } from './officer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Officer } from '@entity';
import { OfficerResolver } from './officer.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Officer])],
  providers: [OfficerService, OfficerResolver],
})
export class OfficerModule {}

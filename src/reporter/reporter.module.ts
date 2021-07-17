import { Module } from '@nestjs/common';
import { ReporterService } from './reporter.service';
import { ReporterResolver } from './reporter.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient, Reporter, Ticket } from '@entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reporter, Patient, Ticket])],
  providers: [ReporterService, ReporterResolver],
})
export class ReporterModule {}

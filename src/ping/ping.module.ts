import { Module } from '@nestjs/common';
import { PingController } from './ping.controller';
import { PingResolver } from './ping.resolver';

@Module({
  controllers: [PingController],
  providers: [PingResolver],
})
export class PingModule {}

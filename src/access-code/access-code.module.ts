import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessCode, Hospital } from '@entity';
import { AccessCodeResolver } from './access-code.resolver';
import { AccessCodeService } from './access-code.service';

@Module({
  imports: [TypeOrmModule.forFeature([AccessCode, Hospital])],
  providers: [AccessCodeResolver, AccessCodeService],
})
export class AccessCodeModule {}

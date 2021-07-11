import { Module } from '@nestjs/common';
import { InviteService } from './invite.service';
import { InviteController } from './invite.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessCode } from 'src/entities/AccessCode.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccessCode])],
  providers: [InviteService],
  controllers: [InviteController],
})
export class InviteModule {}

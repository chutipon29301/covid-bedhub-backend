import { Module } from '@nestjs/common';
import { InviteService } from './invite.service';
import { InviteController } from './invite.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Officer, AccessCode } from '@entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccessCode, Officer])],
  providers: [InviteService],
  controllers: [InviteController],
})
export class InviteModule {}

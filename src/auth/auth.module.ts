import { HttpModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LineModule } from '../line/line.module';
import { UserModule } from '../user/user.module';
import { JwtAuthModule } from '../jwt-auth/jwt-auth.module';
import { AuthResolver } from './auth.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Officer } from '@entity';

@Module({
  imports: [HttpModule, LineModule, UserModule, JwtAuthModule, TypeOrmModule.forFeature([Officer])],
  providers: [AuthService, AuthResolver],
  controllers: [AuthController],
})
export class AuthModule {}

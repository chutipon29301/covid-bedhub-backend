import { HttpModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LineModule } from '../line/line.module';
import { UserModule } from '../user/user.module';
import { JwtAuthModule } from '../jwt-auth/jwt-auth.module';

@Module({
  imports: [HttpModule, LineModule, UserModule, JwtAuthModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

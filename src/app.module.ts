import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config, Env } from './config';
import { HealthController } from './health/health.controller';
import { HospitalModule } from './hospital/hospital.module';
import { PatientModule } from './patient/patient.module';
import { TicketModule } from './ticket/ticket.module';
import { UserModule } from './user/user.module';
import { LineModule } from './line/line.module';
import { AuthModule } from './auth/auth.module';
import { InviteModule } from './invite/invite.module';
import { JwtAuthModule } from './jwt-auth/jwt-auth.module';
import { AuthHeaderParserMiddleware } from './middleware/auth-header-parser.middleware';
import { APP_GUARD } from '@nestjs/core';
import { PermissionsGuard } from './guard/permission.guard';
import { PingModule } from './ping/ping.module';
import { OfficerModule } from './officer/officer.module';

@Module({
  imports: [
    TerminusModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env>): TypeOrmModuleOptions => {
        return config.get('databaseConfig');
      },
    }),
    HospitalModule,
    PatientModule,
    OfficerModule,
    TicketModule,
    UserModule,
    LineModule,
    AuthModule,
    JwtAuthModule,
    PingModule,
    InviteModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthHeaderParserMiddleware).forRoutes('*');
  }
}

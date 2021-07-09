import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config, Env } from './config';
import { HealthController } from './health/health.controller';
import { HospitalModule } from './hospital/hospital.module';
import { ProfileModule } from './profile/profile.module';
import { TicketModule } from './ticket/ticket.module';
import { LineModule } from './line/line.module';
import { UserModule } from './user/user.module';

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
    ProfileModule,
    TicketModule,
    LineModule,
    UserModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}

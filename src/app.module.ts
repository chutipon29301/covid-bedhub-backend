import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { config, Env } from './config';
import { HealthController } from './health/health.controller';
import { HospitalModule } from './hospital/hospital.module';
import { PatientModule } from './patient/patient.module';
import { TicketModule } from './ticket/ticket.module';
import { UserModule } from './user/user.module';
import { LineModule } from './line/line.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthModule } from './jwt-auth/jwt-auth.module';
import { AuthHeaderParserMiddleware } from './middleware/auth-header-parser.middleware';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { PermissionsGuard } from './guard/permission.guard';
import { PingModule } from './ping/ping.module';
import { OfficerModule } from './officer/officer.module';
import { ReporterModule } from './reporter/reporter.module';
import { AccessCodeModule } from './access-code/access-code.module';
import { SentryInterceptor } from './sentry.interceptor';

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
    GraphQLModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        autoSchemaFile: true,
        playground: configService.get<string>('NODE_ENV') !== 'production',
        context: ({ req }) => ({ req }),
        fieldResolverEnhancers: ['guards'],
      }),
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
    ReporterModule,
    AccessCodeModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SentryInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthHeaderParserMiddleware).forRoutes('*');
  }
}

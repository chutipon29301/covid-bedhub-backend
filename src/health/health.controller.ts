import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { AllowUnauthenticated } from '@decorator';

@Controller('health')
export class HealthController {
  constructor(private health: HealthCheckService, private typeorm: TypeOrmHealthIndicator) {}

  @AllowUnauthenticated
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.typeorm.pingCheck('database')]);
  }
}

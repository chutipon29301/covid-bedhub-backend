import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(private health: HealthCheckService, private typeorm: TypeOrmHealthIndicator) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.typeorm.pingCheck('database')]);
  }
}

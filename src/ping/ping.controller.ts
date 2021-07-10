import { Controller, Get } from '@nestjs/common';
import { AllowAnyPermission } from '../decorators/allow-any-permission.decorator';
import { AllowUnauthenticated } from '../decorators/allow-unauthenticated.decorator';
import { Roles } from '../decorators/roles.decorator';

@Controller('ping')
export class PingController {
  @AllowUnauthenticated
  @Get('')
  pingAllowUnauthenticated() {
    return { msg: 'pong' };
  }

  @AllowAnyPermission
  @Get('any-permission')
  pingAllowAnyPermission() {
    return { msg: 'pong' };
  }

  @Roles('patient')
  @Get('patient')
  pingPatient() {
    return { msg: 'pong' };
  }
}

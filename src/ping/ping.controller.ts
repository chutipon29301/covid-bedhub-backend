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

  @Roles('profile')
  @Get('profile')
  pingPatient() {
    return { msg: 'pong' };
  }

  @Roles('staff')
  @Get('staff')
  pingStaff() {
    return { msg: 'pong' };
  }

  @Roles('queue_manager')
  @Get('queue-manager')
  pingQueueManager() {
    return { msg: 'pong' };
  }

  @Roles('code_generator')
  @Get('code-generator')
  pingCodeGenerator() {
    return { msg: 'pong' };
  }
}

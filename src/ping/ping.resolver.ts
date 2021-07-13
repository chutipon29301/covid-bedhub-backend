import { Query, Resolver } from '@nestjs/graphql';
import { AllowAnyPermission, AllowUnauthenticated, Roles } from '@decorator';
import { PingResponseDto } from './dto/ping.dto';

@Resolver(() => PingResponseDto)
export class PingResolver {
  @AllowUnauthenticated
  @Query(() => PingResponseDto)
  pingAllowUnauthenticated(): PingResponseDto {
    return { msg: 'pong' };
  }

  @AllowAnyPermission
  @Query(() => PingResponseDto)
  pingAllowAnyPermission(): PingResponseDto {
    return { msg: 'pong' };
  }

  @Roles('reporter')
  @Query(() => PingResponseDto)
  pingReporter(): PingResponseDto {
    return { msg: 'pong' };
  }

  @Roles('staff')
  @Query(() => PingResponseDto)
  pingStaff(): PingResponseDto {
    return { msg: 'pong' };
  }

  @Roles('queue_manager')
  @Query(() => PingResponseDto)
  pingQueueManager(): PingResponseDto {
    return { msg: 'pong' };
  }

  @Roles('code_generator')
  @Query(() => PingResponseDto)
  pingCodeGenerator(): PingResponseDto {
    return { msg: 'pong' };
  }
}

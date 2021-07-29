import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AccessCode } from '@entity';
import { AccessCodeService } from './access-code.service';
import { AllowUnauthenticated } from '../decorators';
import { AccessCodeHospital } from './dto/access-code.dto';

@Resolver(() => AccessCode)
export class AccessCodeResolver {
  constructor(private readonly service: AccessCodeService) {}

  @AllowUnauthenticated
  @Query(() => AccessCode)
  checkAccessCode(@Args('access_code') accessCode: string): Promise<AccessCode> {
    return this.service.findOne({ accessCode });
  }

  @AllowUnauthenticated
  @ResolveField(() => AccessCodeHospital)
  hospital(@Parent() parent: AccessCode): Promise<AccessCodeHospital> {
    return this.service.findHospital.load(parent.hospitalId);
  }
}

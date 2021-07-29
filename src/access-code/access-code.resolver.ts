import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AccessCode, Hospital } from '@entity';
import { AccessCodeService } from './access-code.service';
import { AllowUnauthenticated } from '../decorators';

@Resolver(() => AccessCode)
export class AccessCodeResolver {
  constructor(private readonly service: AccessCodeService) {}

  @AllowUnauthenticated
  @Query(() => AccessCode)
  checkAccessCode(@Args('access_code') accessCode: string): Promise<AccessCode> {
    return this.service.findOne({ accessCode });
  }

  @ResolveField(() => Hospital)
  hospital(@Parent() parent: AccessCode): Promise<Hospital> {
    return this.service.findHospital.load(parent.hospitalId);
  }
}

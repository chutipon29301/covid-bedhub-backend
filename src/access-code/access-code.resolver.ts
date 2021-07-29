import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AccessCode } from '@entity';
import { AccessCodeService } from './access-code.service';
import { AllowUnauthenticated, DataArgs, GqlUserToken, Roles } from '../decorators';
import { AccessCodeHospital } from './dto/access-code.dto';
import { UpdateAccessCodeDto } from 'src/hospital/dto/hospital.dto';
import { JwtPayload } from 'src/jwt-auth/dto/jwt-auth.dto';

@Resolver(() => AccessCode)
export class AccessCodeResolver {
  constructor(private readonly service: AccessCodeService) {}

  @AllowUnauthenticated
  @Query(() => AccessCode)
  checkAccessCode(@Args('access_code') accessCode: string): Promise<AccessCode> {
    return this.service.findOne({ accessCode });
  }

  @Roles('code_generator')
  @Mutation(() => AccessCode)
  updateAccessCode(@GqlUserToken() userToken: JwtPayload, @DataArgs() data: UpdateAccessCodeDto): Promise<AccessCode> {
    return this.service.updateCode(userToken.id, data.userType, data.accessCode);
  }

  @AllowUnauthenticated
  @ResolveField(() => AccessCodeHospital)
  hospital(@Parent() parent: AccessCode): Promise<AccessCodeHospital> {
    return this.service.findHospital.load(parent.hospitalId);
  }
}

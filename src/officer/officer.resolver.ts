import { Hospital, Officer } from '@entity';
import { AllowUnauthenticated, DataArgs, GqlUserToken, Roles } from '@decorator';
import { CreateOfficerDto, UpdateOfficerDto } from './dto/officer.dto';
import { OfficerService } from './officer.service';
import { JwtPayload } from '../jwt-auth/dto/jwt-auth.dto';
import { Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

@Resolver(() => Officer)
export class OfficerResolver {
  constructor(private readonly service: OfficerService) {}

  @Roles('staff', 'code_generator', 'queue_manager')
  @Query(() => Officer)
  myOfficer(@GqlUserToken() user: JwtPayload): Promise<Officer> {
    return this.service.findOne(user.id);
  }

  @AllowUnauthenticated
  @Mutation(() => Officer)
  createOfficer(@DataArgs() body: CreateOfficerDto): Promise<Officer> {
    return this.service.createOfficer(body);
  }

  @Roles('staff', 'code_generator', 'queue_manager')
  @Mutation(() => Officer)
  updateMyOfficer(@GqlUserToken() user: JwtPayload, @DataArgs() officer: UpdateOfficerDto): Promise<Officer> {
    return this.service.updateOne({ id: user.id }, officer);
  }

  @Roles('staff', 'code_generator', 'queue_manager')
  @ResolveField(() => Hospital)
  hospital(@Parent() officer: Officer): Promise<Hospital> {
    return this.service.findHospital.load(officer.hospitalId);
  }
}

import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AccessCode, Hospital } from '@entity';
import { HospitalService } from './hospital.service';
import { AllowUnauthenticated, DataArgs, GqlUserToken, IdArgs, NullableQuery, Roles } from '@decorator';
import { JwtPayload } from '../jwt-auth/dto/jwt-auth.dto';
import { CreateHospitalDto, EditHospitalDto, UpdateAccessCodeDto } from './dto/hospital.dto';

@Resolver(() => Hospital)
export class HospitalResolver {
  constructor(private readonly service: HospitalService) {}

  @Roles('super_admin')
  @Query(() => [Hospital])
  hospitals(): Promise<Hospital[]> {
    return this.service.findMany();
  }

  @Roles('super_admin')
  @NullableQuery(() => Hospital)
  hospital(@IdArgs() id: number): Promise<Hospital> {
    return this.service.findOne(id);
  }

  @Roles('super_admin')
  @Mutation(() => Hospital)
  createHospital(@DataArgs() data: CreateHospitalDto): Promise<Hospital> {
    return this.service.create({ ...data, location: { x: data.lat, y: data.lng } });
  }

  @Roles('code_generator', 'queue_manager', 'reporter')
  @Query(() => Hospital)
  myHospital(@GqlUserToken() user: JwtPayload): Promise<Hospital> {
    return this.service.findOfficerHospital(user.id);
  }

  @Roles('code_generator')
  @Mutation(() => AccessCode)
  updateAccessCode(@GqlUserToken() userToken: JwtPayload, @DataArgs() data: UpdateAccessCodeDto): Promise<AccessCode> {
    return this.service.updateCode(userToken.id, data.userType, data.accessCode);
  }

  @AllowUnauthenticated
  @Query(() => Hospital)
  checkAccessCode(@Args('access_code') accessCode: string): Promise<Hospital> {
    return this.service.checkAccessCodeValid(accessCode);
  }

  @Roles('super_admin')
  @Mutation(() => Hospital)
  editHospital(@IdArgs() id: number, @DataArgs() data: EditHospitalDto): Promise<Hospital> {
    return this.service.updateOne({ id }, data);
  }

  @Roles('super_admin', 'code_generator')
  @ResolveField(() => [AccessCode])
  accessCodes(@Parent() hospital: Hospital): Promise<AccessCode[]> {
    return this.service.findAccessCode.load(hospital.id);
  }
}

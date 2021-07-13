import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { Hospital } from '@entity';
import { HospitalService } from './hospital.service';
import { DataArgs, GqlUserToken, IdArgs, NullableQuery, Roles } from '@decorator';
import { JwtPayload } from '../jwt-auth/dto/jwt-auth.dto';
import { EditHospitalDto, UpdateAccessCodeDto } from './dto/hospital.dto';

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

  @Roles('code_generator', 'queue_manager', 'reporter')
  @Query(() => Hospital)
  myHospital(@GqlUserToken() user: JwtPayload): Promise<Hospital> {
    return this.service.findOfficerHospital(user.id);
  }

  @Roles('code_generator')
  @Mutation(() => Hospital)
  updateAccessCode(@GqlUserToken() user: JwtPayload, @DataArgs() data: UpdateAccessCodeDto): Promise<Hospital> {
    return this.service.updateCode(user.id, data.userType, data.accessCode);
  }

  @Roles('super_admin')
  @Mutation(() => Hospital)
  editHospital(@IdArgs() id: number, @DataArgs() data: EditHospitalDto): Promise<Hospital> {
    return this.service.updateOne({ id }, data);
  }
}

import { DataArgs, GqlUserToken, IdArgs, Roles } from '@decorator';
import { Patient } from '@entity';
import { Float, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { differenceInYears } from 'date-fns';
import { JwtPayload } from '../jwt-auth/dto/jwt-auth.dto';
import { CreatePatientDto, UpdatePatientDto } from './dto/patient.dto';
import { PatientService } from './patient.service';

@Resolver(() => Patient)
export class PatientResolver {
  constructor(private readonly service: PatientService) {}

  @Roles('reporter')
  @Query(() => Patient)
  patient(@GqlUserToken() user: JwtPayload, @IdArgs() id: number): Promise<Patient> {
    return this.service.findOne({ where: { id, reporterId: user.id } });
  }

  @Roles('reporter')
  @Mutation(() => Patient)
  createPatient(@GqlUserToken() user: JwtPayload, @DataArgs() body: CreatePatientDto): Promise<Patient> {
    return this.service.create({ ...body, reporterId: user.id });
  }

  @Roles('reporter')
  @Mutation(() => Patient)
  updatePatient(@IdArgs() id: number, @DataArgs() body: UpdatePatientDto): Promise<Patient> {
    return this.service.updateOne({ id }, body);
  }

  @Roles('reporter')
  @Mutation(() => Patient)
  deletePatient(@IdArgs() id: number): Promise<Patient> {
    return this.service.deleteOne({ id });
  }

  @Roles('reporter', 'queue_manager')
  @ResolveField(() => Int)
  age(@Parent() parent: Patient): number {
    return differenceInYears(new Date(), new Date(parent.birthDate));
  }
}

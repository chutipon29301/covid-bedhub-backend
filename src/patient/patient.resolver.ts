import { DataArgs, GqlUserToken, IdArgs, Roles } from '@decorator';
import { Patient } from '@entity';
import { Body, NotFoundException } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtPayload } from '../jwt-auth/dto/jwt-auth.dto';
import { CreatePatientDto, UpdatePatientDto } from './dto/patient.dto';
import { PatientService } from './patient.service';

@Resolver()
export class PatientResolver {
  constructor(private readonly service: PatientService) {}
  @Roles('reporter')
  @Query(() => [Patient])
  patients(@GqlUserToken() user: JwtPayload): Promise<Patient[]> {
    return this.service.findMany({ reporterId: user.id });
  }

  @Roles('reporter')
  @Query(() => Patient)
  patient(@GqlUserToken() user: JwtPayload, @IdArgs() id: number): Promise<Patient> {
    const patient = this.service.findOne({ where: { id, reporterId: user.id } });
    if (!patient) {
      throw new NotFoundException('User not found under reporters');
    }
    return patient;
  }

  @Roles('reporter')
  @Mutation(() => Patient)
  createPatient(@GqlUserToken() user: JwtPayload, @DataArgs() body: CreatePatientDto): Promise<Patient> {
    return this.service.createPatient(user.id, body);
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
}

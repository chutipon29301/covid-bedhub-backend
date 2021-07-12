import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { IdParam } from '../decorators/id.decorator';
import { AllowUnauthenticated } from '../decorators/allow-unauthenticated.decorator';
import { PatientService } from './patient.service';
import { CreatePatientDto, UpdatePatientDto } from './dto/patient.dto';
import { Patient } from '../entities';
import { UserToken } from '../decorators/user-token.decorator';
import { JwtPayload } from '../jwt-auth/dto/jwt-auth.dto';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}
  @AllowUnauthenticated
  @Get()
  async list(@UserToken() user: JwtPayload): Promise<Patient[]> {
    return this.patientService.findMany({ profileId: user.id });
  }

  @AllowUnauthenticated
  @Post()
  async add(@Body() body: CreatePatientDto): Promise<Patient> {
    body.userId = 1;
    return await this.patientService.create(body);
  }

  @Patch('/:id')
  async edit(@IdParam() id: number, @Body() Patient: UpdatePatientDto) {
    return this.patientService.updateOne({ id }, Patient);
  }

  @Delete('/:id')
  async delete(@IdParam() id: number) {
    await this.patientService.deleteOne({
      where: { id },
    });
  }
}

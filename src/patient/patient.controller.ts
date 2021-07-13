import { Body, Controller, Delete, Get, NotFoundException, Patch, Post } from '@nestjs/common';
import { Patient } from '@entity';
import { IdParam, UserToken, Roles } from '@decorator';

import { PatientService } from './patient.service';
import { CreatePatientDto, UpdatePatientDto } from './dto/patient.dto';
import { JwtPayload } from '../jwt-auth/dto/jwt-auth.dto';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Roles('reporter')
  @Get()
  async list(@UserToken() user: JwtPayload): Promise<Patient[]> {
    return this.patientService.findMany({ reporterId: user.id });
  }

  @Roles('reporter')
  @Get('/:id')
  async getPatient(@UserToken() user: JwtPayload, @IdParam() id: number): Promise<Patient> {
    const patient = await this.patientService.findOne({ where: { id, reporterId: user.id } });
    if (!patient) {
      throw new NotFoundException('User not found under reporters');
    }
    return patient;
  }

  @Roles('reporter', 'queue_manager')
  @Post()
  async add(@UserToken() user: JwtPayload, @Body() body: CreatePatientDto): Promise<Patient> {
    body.reporterId = user.id;
    return await this.patientService.create(body);
  }

  @Patch('/:id')
  async edit(@IdParam() id: number, @Body() patient: UpdatePatientDto) {
    return this.patientService.updateOne({ id }, patient);
  }

  @Delete('/:id')
  async delete(@IdParam() id: number) {
    await this.patientService.deleteOne({
      where: { id },
    });
  }
}

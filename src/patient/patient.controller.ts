import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from '../entities/Patient.entity';
import { IdParam } from '../decorators/id.decorator';
import { AllowUnauthenticated } from '../decorators/allow-unauthenticated.decorator';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}
  @AllowUnauthenticated
  @Get()
  async list(): Promise<Patient[]> {
    return this.patientService.findMany();
  }

  @AllowUnauthenticated
  @Post()
  async add(@Body() body: CreatePatientDto): Promise<Patient> {
    body.userId = 1;
    return await this.patientService.create(body);
    // return await this.patientService.create(body);
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

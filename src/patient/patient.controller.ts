import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { PatientService } from './Patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from '../entities/Patient.entity';
import { IdParam } from '../decorators/id.decorator';

@Controller('Patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  async list(): Promise<Patient[]> {
    return this.patientService.findMany();
  }

  @Post()
  async add(@Body() body: CreatePatientDto): Promise<Patient> {
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

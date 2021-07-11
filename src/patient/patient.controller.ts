import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { PatientService } from './Patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from '../entities/Patient.entity';
import { AllowUnauthenticated } from 'src/decorators/allow-unauthenticated.decorator';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  async list(): Promise<Patient[]> {
    return this.patientService.findMany();
  }

  @AllowUnauthenticated
  @Post()
  async add(@Body() body: CreatePatientDto): Promise<Patient> {
    body.userId = 1;
    return await this.patientService.createOne(body);
    // return await this.patientService.create(body);
  }

  @Patch('/:id')
  async edit(@Param('id', new ParseIntPipe()) id: number, @Body() Patient: UpdatePatientDto) {
    return this.patientService.updateOne({ id }, Patient);
  }

  @Delete('/:id')
  async delete(@Param('id', new ParseIntPipe()) id: number) {
    await this.patientService.deleteOne({
      where: { id },
    });
  }
}

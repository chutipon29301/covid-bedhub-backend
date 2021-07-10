import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { Hospital } from 'src/entities/Hospital.entity';
import { HospitalService } from './hospital.service';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { AccessCode } from 'src/entities/AccessCode.entity';
@Controller('hospital')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}
  @Get()
  async list(): Promise<Hospital[]> {
    return this.hospitalService.findMany();
  }

  @Post()
  async add(@Body() body: CreateHospitalDto): Promise<Hospital> {
    console.log(body);
    return await this.hospitalService.createOne(body);
    // return await this.hospitalService.create(body);
  }

  @Patch('/:id')
  async edit(@Param('id', new ParseIntPipe()) id: number, @Body() hospital: UpdateHospitalDto) {
    return this.hospitalService.updateOne({ id }, hospital);
  }

  @Delete('/:id')
  async delete(@Param('id', new ParseIntPipe()) id: number) {
    await this.hospitalService.deleteOne({
      where: { id },
    });
  }
}

import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';

import { UserToken, IdParam, Roles } from '@decorator';
import { JwtPayload } from '../jwt-auth/dto/jwt-auth.dto';
import { HospitalService } from './hospital.service';
import { CreateHospitalDto, UpdateCodeDto, UpdateHospitalDto } from './dto/hospital.dto';
import { Hospital } from '@entity';

@Controller('hospital')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  @Get()
  async list(): Promise<Hospital[]> {
    return this.hospitalService.findMany();
  }

  @Roles('code_generator')
  @Get('/:id')
  async show(@IdParam() id: number): Promise<Hospital> {
    return this.hospitalService.findOfficerHospital(id);
  }

  // @Roles('code_generator')
  // @Post('/:id')
  // async add(@Body() body: CreateHospitalDto): Promise<Hospital> {
  //   return await this.hospitalService.createOne(body);
  // }

  @Roles('code_generator')
  @Patch('/:id')
  async edit(@IdParam() id: number, @Body() hospital: UpdateHospitalDto) {
    return this.hospitalService.updateOne({ id }, hospital);
  }

  @Delete('/:id')
  async delete(@IdParam() id: number) {
    await this.hospitalService.deleteOne({
      where: { id },
    });
  }
}

import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';

import { UserToken } from '../decorators/user-token.decorator';
import { JwtPayload } from '../jwt-auth/dto/jwt-auth.dto';
import { AllowUnauthenticated } from '../decorators/allow-unauthenticated.decorator';
import { HospitalService } from './hospital.service';
import { CreateHospitalDto, UpdateCodeDto, UpdateHospitalDto } from './dto/hospital.dto';
import { Hospital } from '../entities';

@Controller('hospital')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}
  @Get()
  async list(): Promise<Hospital[]> {
    return this.hospitalService.findMany();
  }

  @Post()
  async add(@Body() body: CreateHospitalDto): Promise<Hospital> {
    return await this.hospitalService.createOne(body);
    // return await this.hospitalService.create(body);
  }

  @AllowUnauthenticated
  @Post('/set-code')
  async setCode(@UserToken() user: JwtPayload, @Body() body: UpdateCodeDto): Promise<Hospital> {
    const user_id = 1;
    // return await this.hospitalService.updateCode(user.id, body.userType, body.newCode);
    return await this.hospitalService.updateCode(user_id, body.userType, body.newCode);
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

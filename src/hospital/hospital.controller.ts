import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';

import { UserToken } from '../decorators/user-token.decorator';
import { JwtPayload } from '../jwt-auth/dto/jwt-auth.dto';
import { AllowUnauthenticated } from '../decorators/allow-unauthenticated.decorator';
import { HospitalService } from './hospital.service';
import { CreateHospitalDto, UpdateCodeDto, UpdateHospitalDto } from './dto/hospital.dto';
import { Hospital } from '../entities';
import { IdParam } from '../decorators/id.decorator';

@Controller('hospital')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}
  @Get()
  async list(): Promise<Hospital[]> {
    return this.hospitalService.findMany();
  }

  @AllowUnauthenticated
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

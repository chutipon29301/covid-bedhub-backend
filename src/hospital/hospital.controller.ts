import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';

import { UserToken } from '../decorators/user-token.decorator';
import { JwtPayload } from '../jwt-auth/dto/jwt-auth.dto';
import { HospitalService } from './hospital.service';
import { CreateHospitalDto, UpdateCodeDto, UpdateHospitalDto } from './dto/hospital.dto';
import { Hospital } from '../entities';
import { IdParam } from '../decorators/id.decorator';
import { Roles } from '../decorators/roles.decorator';

@Controller('hospital')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}
  @Get()
  async list(): Promise<Hospital[]> {
    return this.hospitalService.findMany();
  }
  @Roles('code_generator')
  @Post()
  async add(@Body() body: CreateHospitalDto): Promise<Hospital> {
    return await this.hospitalService.createOne(body);
  }

  @Roles('code_generator')
  @Post('/set-code')
  async setCode(@UserToken() user: JwtPayload, @Body() body: UpdateCodeDto): Promise<Hospital> {
    return await this.hospitalService.updateCode(user.id, body.userType, body.newCode);
  }

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

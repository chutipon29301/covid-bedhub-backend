import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { Hospital } from 'src/entities/Hospital.entity';
import { HospitalService } from './hospital.service';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { AccessCode } from 'src/entities/AccessCode.entity';
import { UpdateCodeDto } from './dto/update-code.dto';
import { UserToken } from 'src/decorators/user-token.decorator';
import { JwtPayload } from 'src/jwt-auth/dto/jwt-auth.dto';
import { AllowUnauthenticated } from 'src/decorators/allow-unauthenticated.decorator';
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
    console.log(body);
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

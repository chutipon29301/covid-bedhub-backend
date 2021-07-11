import { Body, Controller, Post } from '@nestjs/common';
import { AllowUnauthenticated } from 'src/decorators/allow-unauthenticated.decorator';
import { Officer } from 'src/entities/Officer.entity';
import { CreateOfficerDto } from './dto/create-officer.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @AllowUnauthenticated
  @Post('/officer')
  async add(@Body() body: CreateOfficerDto): Promise<Officer> {
    return await this.userService.createOfficer(body);
    // return await this.hospitalService.create(body);
  }
}

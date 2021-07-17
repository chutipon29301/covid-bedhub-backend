import { Body, Controller, Post } from '@nestjs/common';
import { Officer } from '@entity';
import { AllowUnauthenticated } from '@decorator';

import { CreateOfficerDto } from './dto/user.dto';
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

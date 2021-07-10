import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from '../entities/Profile.entity';
import { profile } from 'console';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async list(): Promise<Profile[]> {
    return this.profileService.findMany();
  }

  @Post()
  async add(@Body() body: CreateProfileDto): Promise<Profile> {
    return await this.profileService.create(body);
  }

  @Patch('/:id')
  async edit(@Param('id', new ParseIntPipe()) id: number, @Body() profile: UpdateProfileDto) {
    return this.profileService.updateOne({ id }, profile);
  }

  @Delete('/:id')
  async delete(@Param('id', new ParseIntPipe()) id: number) {
    await this.profileService.deleteOne({
      where: { id },
    });
  }
}

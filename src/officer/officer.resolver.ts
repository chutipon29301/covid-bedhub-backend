import { UnauthorizedException } from '@nestjs/common';

import { Officer } from '@entity';
import { DataArgs, GqlUserToken, IdArgs, Roles } from '@decorator';
import { UpdateOfficerDto } from './dto/officer.dto';
import { OfficerService } from './officer.service';
import { JwtPayload } from '../jwt-auth/dto/jwt-auth.dto';
import { Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver(() => Officer)
export class OfficerResolver {
  constructor(private readonly service: OfficerService) {}

  @Roles('staff', 'code_generator', 'queue_manager')
  @Query(() => Officer)
  officer(@GqlUserToken() user: JwtPayload, @IdArgs() id: number): Promise<Officer> {
    if (user.id == id) {
      return this.service.findOne({ id });
    }
    throw new UnauthorizedException('User not authorize to perform this action');
  }
  @Roles('staff', 'code_generator', 'queue_manager')
  @Mutation(() => Officer)
  updateOfficer(
    @GqlUserToken() user: JwtPayload,
    @IdArgs() id: number,
    @DataArgs() officer: UpdateOfficerDto,
  ): Promise<Officer> {
    if (user.id == id) {
      return this.service.updateOne({ id }, officer);
    }
    throw new UnauthorizedException('User not authorize to perform this action');
  }
}

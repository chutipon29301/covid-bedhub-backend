import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AllowUnauthenticated, DataArgs } from '@decorator';
import { JwtTokenInfo } from '../jwt-auth/dto/jwt-auth.dto';
import { AuthService } from './auth.service';
import { LoginWithUsernameDto } from './dto/auth.dto';

@Resolver(() => JwtTokenInfo)
export class AuthResolver {
  constructor(private readonly service: AuthService) {}

  @AllowUnauthenticated
  @Mutation(() => JwtTokenInfo)
  async getJwtFromLineCode(@Args('code') code: string): Promise<JwtTokenInfo> {
    const accessToken = await this.service.getAccessToken(code);
    return this.service.getProfileJwtTokenFromLineToken(accessToken.idToken);
  }

  @AllowUnauthenticated
  @Mutation(() => JwtTokenInfo)
  officerLogin(@DataArgs() data: LoginWithUsernameDto): Promise<JwtTokenInfo> {
    return this.service.getProfileJwtForOfficer(data.username, data.password);
  }
}

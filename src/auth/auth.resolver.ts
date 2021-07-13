import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AllowUnauthenticated } from '@decorator';
import { JwtTokenInfo } from '../jwt-auth/dto/jwt-auth.dto';
import { AuthService } from './auth.service';

@Resolver(() => JwtTokenInfo)
export class AuthResolver {
  constructor(private readonly service: AuthService) {}

  @AllowUnauthenticated
  @Mutation(() => JwtTokenInfo)
  async getJwtFromLineCode(@Args('code') code: string): Promise<JwtTokenInfo> {
    const accessToken = await this.service.getAccessToken(code);
    return this.service.getProfileJwtTokenFromLineToken(accessToken.idToken);
  }
}

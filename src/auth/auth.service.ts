import { HttpService, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { stringify } from 'qs';
import { Env } from '../config';
import { JwtTokenInfo } from '../jwt-auth/dto/jwt-auth.dto';
import { JwtAuthService } from '../jwt-auth/jwt-auth.service';
import { LineService } from '../line/line.service';
import { UserService } from '../user/user.service';
import { LineAccessToken, LineAccessTokenRequestResponse } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly lineCallbackURL: string = '/auth/line/callback';

  constructor(
    private readonly lineService: LineService,
    private readonly configService: ConfigService<Env>,
    private readonly httpService: HttpService,
    private readonly userService: UserService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  getLineAuthenticationPageURL(): string {
    return this.lineService.lineAuthPageURL(this.lineCallbackURL);
  }

  async validateState(encryptedState: string): Promise<boolean> {
    return this.lineService.validateState(encryptedState);
  }

  getCallbackWithAccessCode(accessCode: string): string {
    return `${this.configService.get('frontendURL')}/login?code=${accessCode}`;
  }

  async getProfileJwtTokenFromLineToken(lineToken: string): Promise<JwtTokenInfo> {
    const decodedLineToken = this.lineService.decode(lineToken);
    if (decodedLineToken) {
      const profile = await this.userService.ensureProfile(decodedLineToken.sub);
      return this.jwtAuthService.sign({
        id: profile.id,
        accountType: 'profile',
        hasProfile: !!profile.patients,
      });
    } else {
      throw new UnauthorizedException('Invalid line token');
    }
  }

  async getAccessToken(code: string): Promise<LineAccessToken> {
    const body = {
      grant_type: 'authorization_code',
      code,
      redirect_uri: `${this.configService.get('serverURL')}${this.lineCallbackURL}`,
      client_id: this.configService.get('lineChannelId'),
      client_secret: this.configService.get('lineChannelSecret'),
    };
    return await this.getLineAccessTokenRequest(body);
  }

  private async getLineAccessTokenRequest(body: any): Promise<LineAccessToken> {
    try {
      const result = await this.httpService
        .request<LineAccessTokenRequestResponse>({
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          data: stringify(body),
          url: 'https://api.line.me/oauth2/v2.1/token',
        })
        .toPromise();
      return {
        expireIn: result.data.expires_in,
        idToken: result.data.id_token,
      };
    } catch (error) {
      throw new UnauthorizedException(error.response.data);
    }
  }
}

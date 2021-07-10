import { HttpService, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from '../config';
import { LineAccessToken, LineAccessTokenRequestResponse, LineToken, State } from './dto/line.dto';
import { AES, enc } from 'crypto-js';
import { stringify } from 'qs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LineService {
  private readonly passPhase = 'COVID';
  constructor(
    private readonly configService: ConfigService<Env>,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
  ) {}

  lineAuthPageURL(redirectURL: string, optionalState = ''): string {
    const scope = ['openid'];
    const state = new State(this.passPhase, redirectURL, optionalState);
    return `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${this.configService.get(
      'lineChannelId',
    )}&redirect_uri=${encodeURIComponent(
      `${this.configService.get('serverURL')}${redirectURL}`,
    )}&state=${encodeURIComponent(
      this.encrypt(state.toString(), this.configService.get('lineChannelSecret')),
    )}&scope=${scope.join('%20')}&bot_prompt=aggressive`;
  }

  async getAccessToken(code: string, encryptedState: string): Promise<LineAccessToken> {
    const state = State.from(
      this.decrypt(decodeURIComponent(encryptedState), this.configService.get('lineChannelSecret')),
    );
    if (!state.compareTo(this.passPhase)) {
      throw new UnauthorizedException('Line authenticate wrong callback state');
    }
    const body = {
      grant_type: 'authorization_code',
      code,
      redirect_uri: `${this.configService.get('serverURL')}${state.redirectURLString}`,
      client_id: this.configService.get('lineChannelId'),
      client_secret: this.configService.get('lineChannelSecret'),
    };
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
      throw new UnauthorizedException(error);
    }
  }

  decode(token: string): LineToken {
    try {
      const result = this.jwtService.decode(token) as LineToken;
      return result;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async validateState(encryptedState: string): Promise<boolean> {
    const state = State.from(
      this.decrypt(decodeURIComponent(encryptedState), this.configService.get('lineChannelSecret')),
    );
    if (state.compareTo(this.passPhase)) {
      return true;
    } else {
      throw new UnauthorizedException('Line authenticate wrong callback state');
    }
  }

  private encrypt(message: string, secretPassphrase: string): string {
    return AES.encrypt(message, secretPassphrase).toString();
  }

  private decrypt(encryptedMessage: string, secretPassphrase: string): string {
    return AES.decrypt(encryptedMessage, secretPassphrase).toString(enc.Utf8);
  }
}

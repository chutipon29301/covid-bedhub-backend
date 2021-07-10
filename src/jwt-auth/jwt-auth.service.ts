import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { addDays } from 'date-fns';
import { JwtPayload, JwtTokenInfo } from './dto/jwt-auth.dto';

@Injectable()
export class JwtAuthService {
  constructor(private readonly jwtService: JwtService) {}
  sign(payload: JwtPayload): JwtTokenInfo {
    const token = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });
    return {
      token,
      expireDate: addDays(new Date(), 7),
    };
  }

  async decode(token: string): Promise<JwtPayload> {
    try {
      const result = this.jwtService.decode(token) as JwtPayload;
      return result;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}

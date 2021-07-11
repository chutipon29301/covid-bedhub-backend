import { Body, Controller, Get, Post, Query, Res, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { AllowUnauthenticated } from '../decorators/allow-unauthenticated.decorator';
import { JwtTokenInfo } from '../jwt-auth/dto/jwt-auth.dto';
import { AuthService } from './auth.service';
import { RequestTokenDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @AllowUnauthenticated
  @Get('/login')
  loginWithLine(@Res() res: Response) {
    res.redirect(this.service.getLineAuthenticationPageURL());
  }

  @AllowUnauthenticated
  @Get('line/callback')
  async lineCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
    @Query('errorCode') errorCode: string,
    @Query('errorMessage') errorMessage: string,
    @Res() res: Response,
  ) {
    if (error != null || errorCode != null || errorMessage != null) {
      throw new UnauthorizedException(errorMessage);
    }
    if (await this.service.validateState(state)) {
      res.redirect(this.service.getCallbackWithAccessCode(code));
    } else {
      throw new UnauthorizedException('User not authorize');
    }
  }

  @AllowUnauthenticated
  @Post('line/token')
  async lineAdminAuthToken(@Body() body: RequestTokenDto): Promise<JwtTokenInfo> {
    const accessToken = await this.service.getAccessToken(body.code);
    return this.service.getPatientJwtTokenFromLineToken(accessToken.idToken);
  }
}

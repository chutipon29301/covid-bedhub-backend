import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AccountType, JwtPayload } from '../jwt-auth/dto/jwt-auth.dto';
import { JwtAuthService } from '../jwt-auth/jwt-auth.service';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload;
      token: string;
      authenticationType: 'production' | 'development';
    }
  }
}

@Injectable()
export class AuthHeaderParserMiddleware implements NestMiddleware {
  constructor(private readonly jwtAuthService: JwtAuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const [tokenType, token] = (req.headers.authorization as string).split(' ');
      switch (tokenType) {
        case 'Bearer':
          const user = await this.jwtAuthService.decode(token);
          req.user = user;
          req.token = token;
          req.authenticationType = 'production';
          break;
        case 'Developer':
          const [accountType, id] = token.split('-') as [AccountType, string];
          req.user = {
            accountType,
            id: +id,
          };
          req.token = token;
          req.authenticationType = 'development';
          break;
        default:
          req.user = null;
          req.token = token;
          break;
      }
    } catch (error) {
      req.user = null;
      req.token = null;
    }
    next();
  }
}

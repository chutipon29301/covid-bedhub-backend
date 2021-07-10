import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'src/jwt-auth/dto/jwt-auth.dto';
import { JwtAuthService } from 'src/jwt-auth/jwt-auth.service';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

@Injectable()
export class AuthHeaderParserMiddleware implements NestMiddleware {
  constructor(private readonly jwtAuthService: JwtAuthService) {}
  use(req: any, res: any, next: () => void) {
    throw new Error('Method not implemented.');
  }

  resolve(...args: any[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        this.jwtAuthService
          .decode(req.headers.authorization.split(' ')[1])
          .then(token => {
            req.user = token;
            next();
          })
          .catch(error => {
            req.user = null;
            next();
          });
      } catch (error) {
        req.user = null;
        next();
      }
    };
  }
}

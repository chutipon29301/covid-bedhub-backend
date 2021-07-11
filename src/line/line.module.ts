import { HttpModule, Module } from '@nestjs/common';
import { ConfigService } from '../types';
import { JwtModule } from '@nestjs/jwt';
import { LineService } from './line.service';

@Module({
  imports: [
    HttpModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secretOrPrivateKey: configService.get('lineChannelSecret'),
        signOptions: {
          algorithm: 'HS256',
          audience: configService.get('lineChannelId'),
          issuer: 'https://access.line.me',
        },
      }),
    }),
  ],
  providers: [LineService],
  exports: [LineService],
})
export class LineModule {}

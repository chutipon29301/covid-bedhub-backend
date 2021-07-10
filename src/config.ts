import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export interface Env {
  databaseConfig: TypeOrmModuleOptions;
  lineChannelId: string;
  lineChannelSecret: string;
  serverURL: string;
  frontendURL: string;
}

export const config = (): Env => {
  const config: Env = {
    lineChannelId: process.env.LINE_CHANNEL_ID,
    lineChannelSecret: process.env.LINE_CHANNEL_SECRET,
    serverURL: process.env.SERVER_URL,
    frontendURL: process.env.FRONTEND_URL,
    databaseConfig: {
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [join(__dirname, './**/*.entity{.ts,.js}')],
      synchronize: true,
      extra: {
        charset: 'utf8_unicode_ci',
      },
    },
  };
  return config;
};

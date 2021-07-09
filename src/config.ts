import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export interface Env {
  databaseConfig: TypeOrmModuleOptions;
}

export const config = (): Env => {
  if (process.env.NODE_ENV === 'production') {
    return {
      databaseConfig: {
        type: 'postgres',
        host: '127.0.0.1',
        port: 5432,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
        synchronize: true,
        extra: {
          charset: 'utf8_unicode_ci',
        },
      },
    };
  }

  return {
    databaseConfig: {
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
      synchronize: true,
      logging: true,
      extra: {
        charset: 'utf8_unicode_ci',
      },
    },
  };
};

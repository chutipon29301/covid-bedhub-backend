import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  Sentry.init({
    dsn: 'https://708d035ed97e4351a0363521134e24b8@o917147.ingest.sentry.io/5887262',
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
    integrations: [new Tracing.Integrations.Postgres()],
  });

  await app.listen(process.env.PORT || 3000);
  console.log(`Listening at https://localhost:${process.env.PORT || 3000}`);
}
bootstrap();

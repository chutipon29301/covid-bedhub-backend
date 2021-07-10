import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 3000);
  app.enableCors();
  console.log(`Listening at https://localhost:${process.env.PORT || 3000}`);
}
bootstrap();

import 'reflect-metadata';
import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const application = await NestFactory.create(AppModule);
  const configService = application.get(ConfigService);

  const port = configService.get<number>('BACKEND_PORT') ?? 4000;
  const corsOriginValue = configService.get<string>('BACKEND_CORS_ORIGIN') ?? '*';
  const corsOrigins = corsOriginValue
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
  const corsOrigin = corsOrigins.includes('*') ? '*' : corsOrigins;

  application.use(cookieParser());
  application.enableCors({ origin: corsOrigin, credentials: true });

  await application.listen(port);
  console.log(`API running on port ${port}`);
}

bootstrap();

import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const application = await NestFactory.create(AppModule);
  const configService = application.get(ConfigService);

  const port = configService.get<number>('GATEWAY_PORT') ?? 4000;
  const corsOrigin = configService.get<string>('GATEWAY_CORS_ORIGIN') ?? '*';

  application.enableCors({ origin: corsOrigin, credentials: true });

  await application.listen(port);
  console.log(`Gateway running on port ${port}`);
}

bootstrap();

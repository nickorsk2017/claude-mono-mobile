import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const application = await NestFactory.create(AppModule);
  const configService = application.get(ConfigService);

  const port = configService.get<number>('AUTH_SERVICE_PORT') ?? 4001;

  await application.listen(port);
  console.log(`Auth Service running on port ${port}`);
}

bootstrap();

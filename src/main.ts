import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DatabaseExceptionFilter } from './filters/database-exception.filter';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Ignoruje pola, które nie są w DTO
      forbidNonWhitelisted: true, // Rzuca wyjątek, gdy znajdzie nadmiarowe pola
    }),
  );
  const configService = app.get(ConfigService);
  app.useGlobalFilters(new DatabaseExceptionFilter(configService));
  app.use(cookieParser());
  await app.listen(configService.get('PORT'));
}
bootstrap();

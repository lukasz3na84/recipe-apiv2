import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RecipeModule } from './recipe/recipe.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientsService } from './recipe/ingredients/ingredient.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LoggerMiddleware } from './common/logger/logger.middleware';

// Wczytanie odpowiedniego pliku .env na podstawie NODE_ENV
const env = process.env.NODE_ENV || 'development';
const dotenv_path = path.resolve(process.cwd(), `.env.${env}`);
dotenv.config({ path: dotenv_path });

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60, // w sec
        limit: 1, // ilosc polaczeń w ciągu ttl
      },
    ]),
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        database: configService.get<string>('DB_DATABASE'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        port: configService.get<number>('DB_PORT'),
        autoLoadEntities: true,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    RecipeModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    IngredientsService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

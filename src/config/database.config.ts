import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Wczytanie odpowiedniego pliku .env na podstawie NODE_ENV
const env = process.env.NODE_ENV || 'development';
const dotenv_path = path.resolve(process.cwd(), `.env.${env}`);
dotenv.config({ path: dotenv_path });

// Tworzenie i eksport instancji DataSource dla TypeORM CLI
const configService = new ConfigService();

export default new DataSource({
  type: 'mysql',
  host: configService.get<string>('DB_HOST'),
  database: configService.get<string>('DB_DATABASE'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  port: Number(configService.get<number>('DB_PORT')),
  entities: ['dist/**/*.entity{.ts,.js}'], // Ścieżka do skompilowanych encji
  migrations: ['dist/database/migrations/*.js'], // Ścieżka do skompilowanych migracji
  migrationsTableName: 'migration_mysql', // Tabela dla migracji
});

// wszystko to powyzsze jest powtórzeone i ustawione pod migracje, kiedy nie działa NestJS (czyli nei korzysta z app.module.ts)

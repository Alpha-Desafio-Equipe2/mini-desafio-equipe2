import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  entities: ['src/modules/**/(*Entity).ts'],
  // migrations: ['src/shared/database/migrations/*.ts'],
  synchronize: true
});

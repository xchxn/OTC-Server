// datasource.config.ts
import { DataSource, DataSourceOptions } from 'typeorm';

import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
};

export const AppDataSource = new DataSource(dataSourceOptions);
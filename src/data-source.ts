import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Role } from './entities/Role';
import { User } from './entities/User';
import { Car } from './entities/Car';
import { Unit } from './entities/Unit';
import { TechRequestType } from './entities/TechRequestType';
import { TechRequest } from './entities/TechRequest';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'its_auto',
  synchronize: false, // лучше использовать миграции, но для простоты можно true
  logging: false,
  entities: [Role, User, Car, Unit, TechRequestType, TechRequest],
  migrations: [],
  subscribers: [],
});
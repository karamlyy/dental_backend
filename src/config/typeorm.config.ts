import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  host: process.env.DB_HOST || 'dpg-d55pttf5r7bs73f6mrk0-a',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: 'dental_db_1gzr_user',
  password: 'Spoe2MiynEabsHnxVnI2Bhmu7XoB8lnL',
  database: 'postgresql://dental_db_1gzr_user:Spoe2MiynEabsHnxVnI2Bhmu7XoB8lnL@dpg-d55pttf5r7bs73f6mrk0-a/dental_db_1gzr',
  autoLoadEntities: true,
  synchronize: process.env.NODE_ENV !== 'production',
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
};
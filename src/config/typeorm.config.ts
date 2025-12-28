import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'karamafandi',
  password: 'postgres',
  database: 'dental_db',
  autoLoadEntities: true,
  synchronize: true, 
};
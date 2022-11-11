import { ConfigModuleOptions } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function getConfigModuleRootOpts(): ConfigModuleOptions {
  return {
    envFilePath: [`.env.${process.env.NODE_ENV ?? 'dev'}`],
  };
}

export function getTypeOrmRootOpts(): TypeOrmModuleOptions {
  return {
    type: process.env.DB_TYPE as 'postgres' | 'sqlite',
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    autoLoadEntities: true,
    synchronize: process.env.NODE_ENV !== 'prod',
  };
}

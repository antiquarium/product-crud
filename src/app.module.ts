import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.dev'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'prod',
    }),
  ],
})
export class AppModule {}

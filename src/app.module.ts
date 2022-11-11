import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { getConfigModuleRootOpts, getTypeOrmRootOpts } from './config';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot(getConfigModuleRootOpts()),
    TypeOrmModule.forRoot(getTypeOrmRootOpts()),
    ProductsModule,
  ],
})
export class AppModule {}

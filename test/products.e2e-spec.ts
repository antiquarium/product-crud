import * as request from 'supertest';
import { Repository } from 'typeorm';

import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

import { getConfigModuleRootOpts, getTypeOrmRootOpts } from '../src/config';
import { Product } from '../src/products/entities/product.entity';
import { ProductsModule } from '../src/products/products.module';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;
  let productsRepository: Repository<Product>;

  beforeAll(async () => {
    ConfigModule.forRoot(getConfigModuleRootOpts());
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(getTypeOrmRootOpts()), ProductsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    productsRepository = app.get(getRepositoryToken(Product));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/products (GET)', async () => {
    return request(app.getHttpServer())
      .get('/products')
      .expect(200)
      .expect('[]');
  });
});

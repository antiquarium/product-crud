import * as sqlite from 'sqlite';
import { Database as SqliteDB } from 'sqlite3';
import * as request from 'supertest';

import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { getConfigModuleRootOpts, getTypeOrmRootOpts } from '../src/config';
import { ProductsModule } from '../src/products/products.module';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;
  let db: sqlite.Database;

  beforeAll(async () => {
    ConfigModule.forRoot(getConfigModuleRootOpts());
    db = await sqlite.open({ filename: process.env.DB_NAME, driver: SqliteDB });
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(getTypeOrmRootOpts()), ProductsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await db.close();
  });

  it('/products (GET)', async () => {
    return request(app.getHttpServer())
      .get('/products')
      .expect(200)
      .expect('[]');
  });
});

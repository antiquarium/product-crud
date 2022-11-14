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
  let server: any;

  beforeAll(async () => {
    ConfigModule.forRoot(getConfigModuleRootOpts());
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(getTypeOrmRootOpts()), ProductsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    productsRepository = app.get(getRepositoryToken(Product));
    server = app.getHttpServer();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/products (GET)', () => {
    it('responds with a list of all products', async () => {
      const products: Product[] = [
        {
          Id: 'fed98f29-732d-40e5-98d2-19e1d61b9f6a',
          Name: 'SUGDW apple',
          Price: 500,
          UpdateDate: new Date('2022-11-14T15:00:00.000Z'),
        },
        {
          Id: '4532816c-2a2d-4d56-831e-f58727c350af',
          Name: 'bamboo shoot',
          Price: 50,
          UpdateDate: new Date('2022-11-14T16:00:00.000Z'),
        },
      ];
      await productsRepository.save(products);

      const response = await request(server).get('/products');

      expect(response.status).toEqual(200);
      /* Product requires UpdateDate to be a Date, but API returns a string instead */
      expect(response.body).toEqual(JSON.parse(JSON.stringify(products)));
    });
  });
});

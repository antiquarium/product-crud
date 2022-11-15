import { isUUID } from 'class-validator';
import * as request from 'supertest';
import { Repository } from 'typeorm';

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

import { getConfigModuleRootOpts, getTypeOrmRootOpts } from '../src/config';
import { CreateProductDTO } from '../src/products/dto/create-product.dto';
import { Product } from '../src/products/entities/product.entity';
import { ProductsModule } from '../src/products/products.module';
import { dateToSeconds } from './helpers';

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
    app.useGlobalPipes(new ValidationPipe());
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

  describe('/products/{id} (GET)', () => {
    it('responds with the product with given ID if it exists', async () => {
      const product: Product = {
        Id: 'fed98f29-732d-40e5-98d2-19e1d61b9f6a',
        Name: 'bamboo shoot',
        Price: 50,
        UpdateDate: new Date('2022-11-14T16:00:00.000Z'),
      };
      await productsRepository.save(product);

      const response = await request(server).get(`/products/${product.Id}`);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(JSON.parse(JSON.stringify(product)));
    });

    it('responds with "Not found" if product with given ID doesn\'t exist', async () => {
      const id = 'fed98f29-732d-40e5-98d2-19e1d61b9f6b';
      const product: Product = {
        Id: 'fed98f29-732d-40e5-98d2-19e1d61b9f6a',
        Name: 'bamboo shoot',
        Price: 50,
        UpdateDate: new Date('2022-11-14T16:00:00.000Z'),
      };
      await productsRepository.save(product);

      const response = await request(server).get(`/products/${id}`);

      expect(response.status).toEqual(404);
      expect(response.body).toEqual({
        statusCode: 404,
        error: 'Not Found',
        message:
          'Product with ID "fed98f29-732d-40e5-98d2-19e1d61b9f6b" not found.',
      });
    });

    it('responds with "Bad request" if given ID is not a proper UUID', async () => {
      const id = 'bad-id';
      const product: Product = {
        Id: 'fed98f29-732d-40e5-98d2-19e1d61b9f6a',
        Name: 'bamboo shoot',
        Price: 50,
        UpdateDate: new Date('2022-11-14T16:00:00.000Z'),
      };
      await productsRepository.save(product);

      const response = await request(server).get(`/products/${id}`);

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Validation failed (uuid is expected)',
      });
    });
  });

  describe('/products (POST)', () => {
    it('responds with a newly created product', async () => {
      /* SQLite timestamps are by default precise only up to seconds */
      const beforeCreated = dateToSeconds(new Date());
      const payload: CreateProductDTO = {
        Name: 'bamboo shoot',
        Price: 50,
      };

      const response = await request(server).post('/products').send(payload);

      expect(response.status).toEqual(201);
      expect(response.body.Name).toEqual(payload.Name);
      expect(response.body.Price).toEqual(payload.Price);
      expect(new Date(response.body.UpdateDate).getTime()).toBeGreaterThan(
        beforeCreated,
      );
      expect(isUUID(response.body.Id)).toBeTruthy();
    });

    /* TODO: decide where to test validation; component test for the whole module was the first candidate
      since apparently there is no way to run validation within controller's unit tests */
    it('responds with "Bad request" if Name is absent', async () => {
      const response = await request(server)
        .post('/products')
        .send({ Price: 1 });

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({
        statusCode: 400,
        error: 'Bad Request',
        message: [
          'Name must be shorter than or equal to 100 characters',
          'Name should not be empty',
        ],
      });
    });

    it('responds with "Bad request" if Name is longer than 100 characters', async () => {
      const response = await request(server)
        .post('/products')
        .send({ Name: '*'.repeat(101), Price: 1 });

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({
        statusCode: 400,
        error: 'Bad Request',
        message: ['Name must be shorter than or equal to 100 characters'],
      });
    });

    it('responds with "Bad request" if Price is absent', async () => {
      const response = await request(server)
        .post('/products')
        .send({ Name: 'SUGDW apple' });

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({
        statusCode: 400,
        error: 'Bad Request',
        message: [
          'Price must not be less than 0',
          'Price must be a number conforming to the specified constraints',
        ],
      });
    });

    it('responds with "Bad request" if Price is negative', async () => {
      const response = await request(server)
        .post('/products')
        .send({ Name: 'SUGDW apple', Price: -1 });

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({
        statusCode: 400,
        error: 'Bad Request',
        message: ['Price must not be less than 0'],
      });
    });

    it('responds with "Bad request" if Price is not a number', async () => {
      const response = await request(server)
        .post('/products')
        .send({ Name: 'SUGDW apple', Price: 'NaN' });

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({
        statusCode: 400,
        error: 'Bad Request',
        message: [
          'Price must not be less than 0',
          'Price must be a number conforming to the specified constraints',
        ],
      });
    });
  });
});

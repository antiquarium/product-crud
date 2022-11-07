import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { MockType } from './common';

export const productsRepositoryMockFactory: () => MockType<
  Repository<Product>
> = () => ({
  create: jest.fn((o) => o),
  save: jest.fn(async (o) => Promise.resolve(o)),
  find: jest.fn(async () => Promise.resolve()),
  findOneBy: jest.fn(async () => Promise.resolve()),
  delete: jest.fn(async () => Promise.resolve()),
});

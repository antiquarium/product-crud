import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<unknown>;
};

export const productsRepositoryMockFactory: () => MockType<
  Repository<Product>
> = () => ({});

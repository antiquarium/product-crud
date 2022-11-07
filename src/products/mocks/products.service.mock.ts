import { ProductsService } from '../products.service';
import { MockType } from './common';

export const productServiceMockFactory: () => MockType<ProductsService> =
  () => ({
    getProducts: jest.fn(),
    createProduct: jest.fn(),
  });

import { ProductsService } from '../products.service';
import { MockType } from './common';

export const productServiceMockFactory: () => MockType<ProductsService> =
  () => ({
    getProducts: jest.fn(),
    getProductById: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
  });

import { ProductsService } from '../products.service';
import { MockType } from './common';

export const productServiceMockFactory: () => MockType<ProductsService> =
  () => ({
    createProduct: jest.fn(),
  });

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDTO } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import {
  MockType,
  productsRepositoryMockFactory,
} from './mocks/products.repository.mock';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let repositoryMock: MockType<Repository<Product>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useFactory: productsRepositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repositoryMock = module.get(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    return;
  });
});

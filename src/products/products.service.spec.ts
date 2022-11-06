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

  describe('createProduct()', () => {
    it('saves a newly created product in the repository', async () => {
      const input: CreateProductDTO = {
        Name: "product's name",
        Price: 1.23,
      };
      const product: Product = {
        ...input,
        Id: 'uniqueId',
        UpdateDate: new Date('2022-11-06T15:08:58.893Z'),
      };
      repositoryMock.create.mockReturnValue(product);

      const createdProduct = await service.createProduct(input);

      expect(createdProduct).toEqual(product);
      expect(repositoryMock.save).toHaveBeenCalledWith(product);
      expect(repositoryMock.save).toHaveBeenCalledTimes(1);
    });
  });
});

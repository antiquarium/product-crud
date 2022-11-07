import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductDTO } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { MockType } from './mocks/common';
import { productServiceMockFactory } from './mocks/products.service.mock';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: MockType<ProductsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        { provide: ProductsService, useFactory: productServiceMockFactory },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get(ProductsService);
  });

  describe('getProducts()', () => {
    it('returns all products', async () => {
      const products: Product[] = [
        {
          Name: 'product 1',
          Price: 12.3,
          Id: 'id1',
          UpdateDate: new Date('2022-11-06T15:08:58.893Z'),
        },
        {
          Name: 'product 2',
          Price: 4.56,
          Id: 'id2',
          UpdateDate: new Date('2022-11-07T11:28:44.003Z'),
        },
      ];
      service.getProducts.mockReturnValue(products);

      const actual = await controller.getProducts();

      expect(actual).toEqual(products);
      expect(service.getProducts).toHaveBeenCalledTimes(1);
      expect(service.getProducts).toHaveBeenCalledWith();
    });
  });

  describe('createProduct()', () => {
    it('creates a new product', async () => {
      const payload: CreateProductDTO = {
        Name: 'product 1',
        Price: 12.3,
      };
      const expected: Product = {
        ...payload,
        Id: 'id',
        UpdateDate: new Date('2022-11-06T15:08:58.893Z'),
      };
      service.createProduct.mockReturnValue(expected);

      const actual = await controller.createProduct(payload);

      expect(actual).toEqual(expected);
      expect(service.createProduct).toHaveBeenCalledTimes(1);
      expect(service.createProduct).toHaveBeenCalledWith(payload);
    });
  });
});

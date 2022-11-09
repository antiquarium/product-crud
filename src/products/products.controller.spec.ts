import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
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

  describe('getProductById()', () => {
    it('returns a product', async () => {
      const id = 'uniqueId';
      const product: Product = {
        Name: 'product 1',
        Price: 12.3,
        Id: 'uniqueId',
        UpdateDate: new Date('2022-11-06T15:08:58.893Z'),
      };
      service.getProductById.mockReturnValue(product);

      const actual = await controller.getProductById(id);

      expect(actual).toEqual(product);
      expect(service.getProductById).toHaveBeenCalledTimes(1);
      expect(service.getProductById).toHaveBeenCalledWith(id);
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

  describe('updateProduct()', () => {
    it('updates and returns the updated product', async () => {
      const id = 'uniqueId';
      const payload: UpdateProductDTO = {
        Name: 'new name',
        Price: 20,
      };
      const expected: Product = {
        ...payload,
        Id: id,
        UpdateDate: new Date('2022-11-06T15:08:58.893Z'),
      };
      service.updateProduct.mockReturnValue(expected);

      const actual = await controller.updateProduct(id, payload);

      expect(actual).toEqual(expected);
      expect(service.updateProduct).toHaveBeenCalledTimes(1);
      expect(service.updateProduct).toHaveBeenCalledWith(id, payload);
    });
  });
});

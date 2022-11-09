import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { MockType, productsRepositoryMockFactory } from './mocks';
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

  describe('getProducts()', () => {
    it('returns all products from the repository', async () => {
      const products: Product[] = [
        {
          Name: 'product 1',
          Price: 1.23,
          Id: 'uniqueId1',
          UpdateDate: new Date('2022-11-06T15:08:58.893Z'),
        },
        {
          Name: 'product 2',
          Price: 4.5,
          Id: 'uniqueId2',
          UpdateDate: new Date('2022-11-07T16:09:58.893Z'),
        },
      ];
      repositoryMock.find.mockReturnValue(products);

      const returnedProducts = await service.getProducts();

      expect(returnedProducts).toEqual(products);
      expect(repositoryMock.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('getProductById()', () => {
    it('returns the product if it exists in the repository', async () => {
      const product: Product = {
        Name: "product's name",
        Price: 1.23,
        Id: 'uniqueId',
        UpdateDate: new Date('2022-11-06T15:08:58.893Z'),
      };
      repositoryMock.findOneBy.mockReturnValue(product);

      const found = await service.getProductById(product.Id);

      expect(found).toEqual(product);
    });

    it("throws if the product doesn't exist in the repository", async () => {
      repositoryMock.findOneBy.mockReturnValue(null);
      const id = 'nonexistent';

      expect(async () => await service.getProductById(id)).rejects.toThrowError(
        new NotFoundException(`Product with ID "${id}" not found.`),
      );
    });
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

  describe('updateProduct()', () => {
    it('updates and returns the updated product if it exists in the repository', async () => {
      const id = 'uniqueId';
      const input: UpdateProductDTO = {
        Name: "product's new name",
        Price: 4.56,
      };
      const product: Product = {
        Name: "product's name",
        Price: 1.23,
        Id: id,
        UpdateDate: new Date('2022-11-06T15:08:58.893Z'),
      };
      const expected: Product = { ...product, ...input };
      repositoryMock.findOneBy.mockReturnValue(product);

      const updated = await service.updateProduct(id, input);

      expect(updated).toEqual(expected);
    });

    it("throws if the product doesn't exist in the repository", async () => {
      const id = 'nonexistent';
      const input: UpdateProductDTO = {
        Name: "product's new name",
        Price: 4.56,
      };
      repositoryMock.findOneBy.mockReturnValue(null);

      expect(
        async () => await service.updateProduct(id, input),
      ).rejects.toThrowError(
        new NotFoundException(`Product with ID "${id}" not found.`),
      );
    });
  });

  describe('deleteProduct()', () => {
    it('deletes the product with given ID if it exists in the repository', async () => {
      repositoryMock.delete.mockReturnValue({ affected: 1 });
      const id = 'uniqueId';
      let error: Error;

      try {
        await service.deleteProduct(id);
      } catch (e) {
        error = e;
      }

      expect(error).toBeFalsy();
      expect(repositoryMock.delete).toHaveBeenCalledTimes(1);
      expect(repositoryMock.delete).toHaveBeenCalledWith({ Id: id });
    });

    it("throws if the product doesn't exist in the repository", async () => {
      const id = 'nonexistent';
      repositoryMock.delete.mockReturnValue({ affected: 0 });

      expect(async () => await service.deleteProduct(id)).rejects.toThrowError(
        new NotFoundException(`Product with ID "${id}" not found.`),
      );
    });
  });
});

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async getProductById(id: string): Promise<Product> {
    const found = await this.productsRepository.findOneBy({ Id: id });
    if (!found)
      throw new NotFoundException(`Product with ID "${id}" not found.`);

    return found;
  }

  async createProduct({ Name, Price }: CreateProductDTO): Promise<Product> {
    const product = this.productsRepository.create({
      Name,
      Price,
    });

    return await this.productsRepository.save(product);
  }

  async updateProduct(
    id: string,
    { Name, Price }: UpdateProductDTO,
  ): Promise<Product> {
    const found = await this.getProductById(id);
    const updated: Product = {
      ...found,
      Name,
      Price,
    };

    return this.productsRepository.save(updated);
  }

  async deleteProduct(id: string): Promise<void> {
    const { affected } = await this.productsRepository.delete({ Id: id });
    if (affected < 1)
      throw new NotFoundException(`Product with ID "${id}" not found.`);

    return;
  }
}

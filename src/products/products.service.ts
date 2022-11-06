import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDTO } from './dto/create-product.dto';
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
}

import { Body, Controller, Post } from '@nestjs/common';
import { CreateProductDTO } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('/')
  async createProduct(
    @Body() createProductDTO: CreateProductDTO,
  ): Promise<Product> {
    return await this.productsService.createProduct(createProductDTO);
  }
}

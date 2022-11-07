import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CreateProductDTO } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('/')
  async getProducts(): Promise<Product[]> {
    return await this.productsService.getProducts();
  }

  @Get('/:id')
  async getProductById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Product> {
    return await this.productsService.getProductById(id);
  }

  @Post('/')
  async createProduct(
    @Body() createProductDTO: CreateProductDTO,
  ): Promise<Product> {
    return await this.productsService.createProduct(createProductDTO);
  }
}

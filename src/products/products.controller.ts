import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';

import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
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

  @Put('/:id')
  async updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDTO: UpdateProductDTO,
  ): Promise<Product> {
    return await this.productsService.updateProduct(id, updateProductDTO);
  }

  @Delete('/:id')
  async deleteProduct(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.productsService.deleteProduct(id);
  }
}

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SelectProductInfoDto } from './dtos/product-info.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(readonly productService: ProductService) {}

  @Get('/all')
  async getAllProducts(): Promise<SelectProductInfoDto[]> {
    return await this.productService.getAllProducts();
  }

  @Get('/:id')
  async getProductById(@Param('id') id: number): Promise<SelectProductInfoDto> {
    return await this.productService.getProductById(id);
  }

  @Post('/list')
  async getProductsByIdList(
    @Body() data: Array<number>,
  ): Promise<SelectProductInfoDto[]> {
    console.log(data);
    return await this.productService.getProductsByIdList(data);
  }
}

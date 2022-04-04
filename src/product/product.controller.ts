import { Controller, Get } from '@nestjs/common';
import { SelectProductInfoDto } from './dtos/product-info.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(readonly productService: ProductService) {}

  @Get('/all')
  async getAllProducts(): Promise<SelectProductInfoDto[]> {
    return await this.productService.getAllProducts();
  }
}

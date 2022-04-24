import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileURLToPath } from 'url';
import { InputProductInfoDtd } from './dtos/input-product-info.dto';
import { InsertProductError } from './dtos/insert-product-error.dto';
import { SelectProductInfoDto } from './dtos/product-info.dto';
import { ProductService } from './product.service';
import * as path from 'path';

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

  @Post('new')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/images/product',
        filename: (req, file, callback) => {
          const extension = path.extname(file.originalname);
          const basename = path.basename(file.originalname, extension);
          callback(null, `${basename}-${Date.now()}${extension}`);
        },
      }),
    }),
  )
  async insertProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() product,
  ): Promise<SelectProductInfoDto | InsertProductError> {
    const inputProductDto = new InputProductInfoDtd();
    inputProductDto.productName = product.productName;
    inputProductDto.productMinimumEA = parseInt(product.productMinimumEA);
    inputProductDto.productDescription = product.productDescription;
    inputProductDto.productPrice = parseInt(product.productPrice);
    inputProductDto.productImageFilepath = file.path;

    return await this.productService.insertProduct(inputProductDto);
  }
}

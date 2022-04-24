import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpException,
  Param,
  Post,
  Query,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { InputProductInfoDtd } from './dtos/input-product-info.dto';
import { InsertProductError } from './dtos/product-error.dto';
import { SelectProductInfoDto } from './dtos/product-info.dto';
import { ProductService } from './product.service';
import * as path from 'path';
import { CustomerService } from 'src/customer/customer.service';
import { response } from 'express';

@Controller('product')
export class ProductController {
  constructor(
    readonly productService: ProductService,
    readonly customerService: CustomerService,
  ) {}

  @Get('/all')
  async getAllProducts(): Promise<SelectProductInfoDto[]> {
    return await this.productService.getAllProducts();
  }

  @Get('/:id')
  async getProductById(@Param('id') id: number): Promise<SelectProductInfoDto> {
    return await this.productService.getProductById(id);
  }

  @Post('/new')
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
  ): Promise<SelectProductInfoDto[]> {
    const inputProductDto = new InputProductInfoDtd();
    inputProductDto.productName = product.productName;
    inputProductDto.productMinimumEA = parseInt(product.productMinimumEA);
    inputProductDto.productDescription = product.productDescription;
    inputProductDto.productPrice = parseInt(product.productPrice);
    inputProductDto.productImageFilepath = file.path;

    if (!this.customerService.checkAdmin(parseInt(product.customerId))) {
      // 관리자 계정이 아닐 경우
      const error: InsertProductError = new InsertProductError();
      error.customerRoleError = '관리자 계정이 아닙니다.';
      throw new ForbiddenException({
        error: error,
      });
    } else {
      // 관리자 계정일 경우
      return await this.productService.insertProduct(inputProductDto);
    }
  }

  @Delete('/:productId')
  async deleteProduct(
    @Param('productId') productId: number,
    @Query('customerId') customerId: number,
  ): Promise<SelectProductInfoDto[]> {
    if (!this.customerService.checkAdmin(customerId)) {
      const error: InsertProductError = new InsertProductError();
      error.customerRoleError = '관리자 계정이 아닙니다.';
      throw new ForbiddenException({
        error: error,
      });
    }

    return await this.productService.deleteProduct(productId);
  }
}

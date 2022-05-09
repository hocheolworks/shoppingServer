import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpException,
  Param,
  Post,
  Put,
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
import { ProductReviewDto } from './dtos/product-review.dto';
import ProductInfoEntity from './entities/product.entity';
import ReviewInfoEntity from './entities/review.entity';

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

  @Post('/')
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

    if (isNaN(product.customerId)) {
      throw new BadRequestException({
        error: 'customerId is NaN',
      });
    }

    if (!this.customerService.checkAdmin(parseInt(product.customerId))) {
      const error: InsertProductError = new InsertProductError();
      error.customerRoleError = '관리자 계정이 아닙니다.';
      throw new ForbiddenException({
        error: error,
      });
    }

    return await this.productService.insertProduct(inputProductDto);
  }

  @Delete('/:productId')
  async deleteProduct(
    @Param('productId') productId: number,
    @Query('customerId') customerId: number,
  ): Promise<SelectProductInfoDto[]> {
    const isAdmin: Boolean = await this.customerService.checkAdmin(customerId);
    if (!isAdmin) {
      const error: InsertProductError = new InsertProductError();
      error.customerRoleError = '관리자 계정이 아닙니다.';
      throw new ForbiddenException({
        productError: error,
      });
    }

    return await this.productService.deleteProduct(productId);
  }

  @Put('/:productId/w/image')
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
  async updateProductWithImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('productId') productId: number,
    @Query('customerId') customerId: number,
    @Body() product,
  ): Promise<SelectProductInfoDto> {
    const isAdmin: Boolean = await this.customerService.checkAdmin(customerId);
    if (!isAdmin) {
      const error: InsertProductError = new InsertProductError();
      error.customerRoleError = '관리자 계정이 아닙니다.';
      throw new ForbiddenException({
        productError: error,
      });
    }

    const inputProductDto = new InputProductInfoDtd();
    inputProductDto.productName = product.productName;
    inputProductDto.productMinimumEA = parseInt(product.productMinimumEA);
    inputProductDto.productDescription = product.productDescription;
    inputProductDto.productPrice = parseInt(product.productPrice);
    inputProductDto.productImageFilepath = file.path;

    return this.productService.updateProductWithImage(
      productId,
      inputProductDto,
    );
  }

  @Put('/:productId/w/o/image')
  async updateProductWithoutImage(
    @Param('productId') productId: number,
    @Query('customerId') customerId: number,
    @Body() product,
  ): Promise<SelectProductInfoDto> {
    const isAdmin: Boolean = await this.customerService.checkAdmin(customerId);
    if (!isAdmin) {
      const error: InsertProductError = new InsertProductError();
      error.customerRoleError = '관리자 계정이 아닙니다.';
      throw new ForbiddenException({
        productError: error,
      });
    }

    const inputProductDto = new InputProductInfoDtd();
    inputProductDto.productName = product.productName;
    inputProductDto.productMinimumEA = parseInt(product.productMinimumEA);
    inputProductDto.productDescription = product.productDescription;
    inputProductDto.productPrice = parseInt(product.productPrice);

    console.log(product.productName);
    console.log(parseInt(product.productMinimumEA));
    console.log(product.productDescription);
    console.log(parseInt(product.productPrice));

    return this.productService.updateProductWithoutImage(
      productId,
      inputProductDto,
    );
  }

  @Post('/review')
  async addReview(
    @Body() productReviewDto: Partial<ProductReviewDto>,
  ): Promise<{
    'product': ProductInfoEntity,
    'reviews': Array<ReviewInfoEntity>,
  }> {
    return this.productService.insertReview(productReviewDto);
  }

  @Put('/review')
  async deleteReview(
    @Body() productReviewDto: Partial<ProductReviewDto>
  ): Promise<any> {
    return this.productService.deleteReview(productReviewDto);
  }
}

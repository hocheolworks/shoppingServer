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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesInterceptor } from '@nestjs/platform-express/multer/interceptors/files.interceptor';
import { InputProductInfoDtd } from './dtos/input-product-info.dto';
import { InsertProductError } from './dtos/product-error.dto';
import { SelectProductInfoDto } from './dtos/product-info.dto';
import { ProductService } from './product.service';
import * as path from 'path';
import { CustomerService } from 'src/customer/customer.service';
import { ProductReviewDto } from './dtos/product-review.dto';
import ProductInfoEntity from './entities/product.entity';
import ReviewInfoEntity from './entities/review.entity';
import * as multerS3 from 'multer-s3';
import * as AWS from 'aws-sdk';

const s3 = new AWS.S3();
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

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
      storage: multerS3({
        s3: s3,
        bucket: 'iljo-product',
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
          const extension = path.extname(file.originalname);
          cb(
            null,
            file.originalname.replace(extension, '') +
              '_' +
              Date.now().toString() +
              extension,
          );
        },
      }),
    }),
  )
  async insertProduct(
    @UploadedFile() file: any,
    @Body() product,
  ): Promise<SelectProductInfoDto[]> {
    const inputProductDto = new InputProductInfoDtd();
    inputProductDto.productName = product.productName;
    inputProductDto.productMinimumEA = parseInt(product.productMinimumEA);
    inputProductDto.productDescription = product.productDescription;
    inputProductDto.productPrice = parseInt(product.productPrice);
    inputProductDto.productImageFilepath = file.location;

    console.log(inputProductDto);

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
    // await this.uploadImage(file);

    return await this.productService.insertProduct(inputProductDto);
  }

  @Delete('/:productId')
  async deleteProduct(
    @Param('productId') productId: number,
    @Query('customerId') customerId: number,
  ): Promise<SelectProductInfoDto[]> {
    const isAdmin: boolean = await this.customerService.checkAdmin(customerId);
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
      storage: multerS3({
        s3: s3,
        bucket: 'iljo-product',
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
          const extension = path.extname(file.originalname);
          cb(null, file.originalname + Date.now().toString() + extension);
        },
      }),
    }),
  )
  async updateProductWithImage(
    @UploadedFile() file: any,
    @Param('productId') productId: number,
    @Query('customerId') customerId: number,
    @Body() product,
  ): Promise<SelectProductInfoDto> {
    const isAdmin: boolean = await this.customerService.checkAdmin(customerId);
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
    inputProductDto.productImageFilepath = file.location;

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
    const isAdmin: boolean = await this.customerService.checkAdmin(customerId);
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

    return this.productService.updateProductWithoutImage(
      productId,
      inputProductDto,
    );
  }

  @Post('/review')
  async addReview(
    @Body() productReviewDto: Partial<ProductReviewDto>,
  ): Promise<{
    product: ProductInfoEntity;
    reviews: Array<ReviewInfoEntity>;
  }> {
    return this.productService.insertReview(productReviewDto);
  }

  @Put('/review')
  async deleteReview(
    @Body() productReviewDto: Partial<ProductReviewDto>,
  ): Promise<any> {
    return this.productService.deleteReview(productReviewDto);
  }

  @Get('/review/:id')
  async getReview(@Param('id') productId: number): Promise<{
    product: ProductInfoEntity;
    reviews: Array<ReviewInfoEntity>;
  }> {
    return this.productService.selectReview(productId);
  }

  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: multerS3({
        s3: s3,
        bucket: 'iljo-product',
        acl: 'public-read',
        key: function (req, file, cb) {
          const extension = path.extname(file.originalname);
          cb(
            null,
            file.originalname.replace(extension, '') +
              '_' +
              Date.now().toString() +
              extension,
          );
        },
      }),
    }),
  )
  @Post('/detail/images')
  uploadImage(@UploadedFiles() files: Array<any>): Array<string> {
    return files.map((val) => val.location);
  }
}

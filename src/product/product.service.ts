import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import ProductInfoEntity from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { SelectProductInfoDto } from './dtos/product-info.dto';
import { InputProductInfoDtd } from './dtos/input-product-info.dto';
import { InsertProductError } from './dtos/product-error.dto';
import * as fs from 'fs';
import CustomerInfoEntity from 'src/customer/entities/customer.entity';
import ReviewInfoEntity from './entities/review.entity';
import { ProductReviewDto } from './dtos/product-review.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductInfoEntity)
    private readonly productInfoRepository: Repository<ProductInfoEntity>,
    @InjectRepository(ReviewInfoEntity)
    private readonly reviewInfoRepository: Repository<ReviewInfoEntity>,
    @InjectRepository(CustomerInfoEntity)
    private readonly customerInfoRepository: Repository<CustomerInfoEntity>,
  ) {}

  async getAllProducts(): Promise<SelectProductInfoDto[]> {
    return this.productInfoRepository
      .createQueryBuilder('product')
      .leftJoin('product.reviews', 'review_info')
      .getMany();
  }

  async getProductById(id: number): Promise<SelectProductInfoDto> {
    return await this.productInfoRepository
      .createQueryBuilder('product')
      .where('product.id = :id', { id: id })
      .leftJoinAndSelect('product.reviews', 'review_info')
      .orderBy("review_info.updatedAt","DESC")
      .getOne();
  }

  async insertProduct(
    body: InputProductInfoDtd,
  ): Promise<SelectProductInfoDto[]> {
    if (
      !Boolean(body.productName) ||
      !Boolean(body.productDescription) ||
      !Boolean(body.productMinimumEA) ||
      !Boolean(body.productPrice) ||
      body.productMinimumEA < 1 ||
      body.productPrice < 0 ||
      !Boolean(body.productImageFilepath)
    ) {
      const productError: InsertProductError = {
        productNameError: '',
        productDescriptionError: '',
        productMinimumEAError: '',
        productPriceError: '',
        productImageFilepathError: '',
        customerRoleError: '',
      };

      if (!Boolean(body.productName)) {
        productError.productNameError = '상품명은 필수 입니다.';
      }

      if (!Boolean(body.productDescription)) {
        productError.productDescriptionError = '상품 설명은 필수 입니다.';
      }

      if (!Boolean(body.productMinimumEA)) {
        productError.productMinimumEAError = '최소 주문 수량은 필수 입니다.';
      } else if (body.productMinimumEA < 1) {
        productError.productMinimumEAError =
          '최소 주문 수량은 0보다 큰 숫자여야 합니다.';
      }

      if (!Boolean(body.productPrice)) {
        productError.productPriceError = '상품 가격은 필수 입니다.';
      } else if (body.productPrice < 0) {
        productError.productPriceError = '상품 가격은 0보다 작을 수 없습니다.';
      }

      if (!Boolean(body.productImageFilepath)) {
        productError.productImageFilepathError = '상품 이미지는 필수 입니다.';
      }

      throw new BadRequestException({
        error: productError,
      });
    }
    try {
      await this.productInfoRepository
        .createQueryBuilder('product')
        .insert()
        .into(ProductInfoEntity)
        .values({
          productName: body.productName,
          productMinimumEA: body.productMinimumEA,
          productPrice: body.productPrice,
          productDescription: body.productDescription,
          productImageFilepath: body.productImageFilepath,
        })
        .execute();

      return await this.productInfoRepository
        .createQueryBuilder('product')
        .getMany();
    } catch (err: any) {
      console.log(err);
      return null;
    }
  }

  async deleteProduct(productId: number): Promise<SelectProductInfoDto[]> {
    try {
      const { product_productImageFilepath } = await this.productInfoRepository
        .createQueryBuilder()
        .select('product.productImageFilepath')
        .from(ProductInfoEntity, 'product')
        .where('product.id = :productId', { productId: productId })
        .getRawOne();

      fs.rm(
        product_productImageFilepath,
        (err: NodeJS.ErrnoException | null) => {
          if (err) {
            switch (err.code) {
              case 'ENOENT':
                console.log('파일이 존재하지 않습니다.');
                break;
              default:
                console.log(err);
                break;
            }
            return;
          }
          console.log(`Successfully remove ${product_productImageFilepath}`);
        },
      );

      await this.productInfoRepository
        .createQueryBuilder('product')
        .delete()
        .from(ProductInfoEntity)
        .where('id = :productId', { productId: productId })
        .execute();

      return await this.productInfoRepository
        .createQueryBuilder('product')
        .getMany();
    } catch (err: any) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async updateProductWithImage(
    productId: number,
    product: InputProductInfoDtd,
  ): Promise<SelectProductInfoDto> {
    const { product_productImageFilepath } = await this.productInfoRepository
      .createQueryBuilder()
      .select('product.productImageFilepath')
      .from(ProductInfoEntity, 'product')
      .where('product.id = :productId', { productId: productId })
      .getRawOne();

    fs.rm(product_productImageFilepath, () => {
      console.log(`Successfully remove ${product_productImageFilepath}`);
    });

    await this.productInfoRepository
      .createQueryBuilder('product')
      .update(ProductInfoEntity)
      .set({
        productName: product.productName,
        productDescription: product.productDescription,
        productImageFilepath: product.productImageFilepath,
        productMinimumEA: product.productMinimumEA,
        productPrice: product.productPrice,
      })
      .where('id = :productId', { productId: productId })
      .execute();

    return await this.productInfoRepository
      .createQueryBuilder('product')
      .where('product.id = :productId', { productId: productId })
      .getOne();
  }

  async updateProductWithoutImage(
    productId: number,
    product: InputProductInfoDtd,
  ): Promise<SelectProductInfoDto> {
    await this.productInfoRepository
      .createQueryBuilder('product')
      .update(ProductInfoEntity)
      .set({
        productName: product.productName,
        productDescription: product.productDescription,
        productMinimumEA: product.productMinimumEA,
        productPrice: product.productPrice,
      })
      .where('id = :productId', { productId: productId })
      .execute();

    return await this.productInfoRepository
      .createQueryBuilder('product')
      .where('product.id = :productId', { productId: productId })
      .getOne();
  }

  async insertReview (
    productReviewDto: ProductReviewDto,
  ): Promise<any> {

    const { customerId, productId, author, message, rating } = productReviewDto;

    const customer = await this.customerInfoRepository.findOne({'id':customerId});
    const product = await this.productInfoRepository.findOne({'id': productId});
    const result = await this.reviewInfoRepository.save({
      customer:customer, 
      product:product, 
      reviewMessage: message, 
      reviewRating: rating,
      author: author,
    });
    
    const reviews = await this.reviewInfoRepository.find({
      where: {product: product},
      order: {updatedAt:'DESC'},
    });
    const response = {
      'product' : product,
      'reviews' : reviews,
    }
    
    return response;
  }
}

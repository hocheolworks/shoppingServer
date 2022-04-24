import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import ProductInfoEntity from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SelectProductInfoDto } from './dtos/product-info.dto';
import { InputProductInfoDtd } from './dtos/input-product-info.dto';
import { InsertProductError } from './dtos/product-error.dto';
import { stringify } from 'querystring';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductInfoEntity)
    private readonly productInfoRepository: Repository<ProductInfoEntity>,
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
      .leftJoinAndSelect('review_info.customer', 'customer_info')
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
}

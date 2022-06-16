import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import ProductInfoEntity from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SelectProductInfoDto } from './dtos/product-info.dto';
import { InputProductInfoDtd } from './dtos/input-product-info.dto';
import { InsertProductError } from './dtos/product-error.dto';
import * as fs from 'fs';
import CustomerInfoEntity from 'src/customer/entities/customer.entity';
import ReviewInfoEntity from './entities/review.entity';
import { ProductReviewDto } from './dtos/product-review.dto';
import * as AWS from 'aws-sdk';
const s3 = new AWS.S3();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

function isValidNumber(numb: number): Boolean {
  if (numb === undefined) return false;
  else if (numb === null) return false;
  else if (isNaN(numb)) return false;
  return true;
}

const extractSrcPath = (productDescription: string): Array<string> => {
  const regex: RegExp = /src=[\"']?([^>\"']*)[\"']?[^>]*/g;
  const regexResult: RegExpMatchArray = productDescription.match(regex);

  if (
    regexResult !== undefined &&
    regexResult !== null &&
    regexResult.length > 0
  ) {
    return regexResult.map((val) => val.slice(5).slice(0, -1));
  } else {
    return [];
  }
};

const getLocation = (imageFullPath: string): string => {
  const splitArray = imageFullPath.split('/');
  if (splitArray.length >= 4) {
    return splitArray.splice(3).join('/');
  } else {
    return null;
  }
};

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
      .orderBy('review_info.updatedAt', 'DESC')
      .getOne();
  }

  async insertProduct(
    body: InputProductInfoDtd,
  ): Promise<SelectProductInfoDto[]> {
    if (
      !Boolean(body.productName) ||
      !Boolean(body.productDescription) ||
      !Boolean(body.productMinimumEA) ||
      !isValidNumber(body.productPrice) ||
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

      if (!isValidNumber(body.productPrice)) {
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
          productPrice1: body.productPrice1,
          productPrice2: body.productPrice2,
          productPrice3: body.productPrice3,
          productPrice4: body.productPrice4,
          productPrice5: body.productPrice5,
          productEA1: body.productEA1,
          productEA2: body.productEA2,
          productEA3: body.productEA3,
          productEA4: body.productEA4,
          productEA5: body.productEA5,
          productDescription: body.productDescription,
          productImageFilepath: body.productImageFilepath,
        })
        .execute();

      return await this.productInfoRepository
        .createQueryBuilder('product')
        .getMany();
    } catch (err: any) {
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }

  async deleteProduct(productId: number): Promise<SelectProductInfoDto[]> {
    try {
      const { product_productImageFilepath, product_productDescription } =
        await this.productInfoRepository
          .createQueryBuilder()
          .select('product.productImageFilepath')
          .addSelect('product.productDescription')
          .from(ProductInfoEntity, 'product')
          .where('product.id = :productId', { productId: productId })
          .getRawOne();

      const ProductImageLocation = decodeURI(
        getLocation(product_productImageFilepath),
      );

      const params: AWS.S3.DeleteObjectsRequest = {
        Bucket: 'iljo-product',
        Delete: { Objects: [{ Key: ProductImageLocation }] },
      };

      const imageSrcPaths = extractSrcPath(product_productDescription);
      imageSrcPaths.forEach((val) =>
        params.Delete.Objects.push({ Key: decodeURI(getLocation(val)) }),
      );

      s3.deleteObjects(params, (err, data) => {
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
        } else {
          console.log(data);
        }
        console.log(`Successfully remove ${ProductImageLocation}`);
      });

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

  async insertReview(productReviewDto: Partial<ProductReviewDto>): Promise<{
    product: ProductInfoEntity;
    reviews: Array<ReviewInfoEntity>;
  }> {
    const { customerId, productId, author, message, rating } = productReviewDto;

    const customer = await this.customerInfoRepository.findOne({
      id: customerId,
    });
    const product = await this.productInfoRepository.findOne({ id: productId });
    const result = await this.reviewInfoRepository.save({
      customer: customer,
      product: product,
      reviewMessage: message,
      reviewRating: rating,
      author: author,
    });

    const reviews = await this.reviewInfoRepository.find({
      where: { product: product },
      order: { updatedAt: 'DESC' },
    });
    const response = {
      product: product,
      reviews: reviews,
    };

    return response;
  }

  async deleteReview(
    productReviewDto: Partial<ProductReviewDto>,
  ): Promise<any> {
    const result = await this.reviewInfoRepository.delete({
      id: productReviewDto.id,
    });
    const product = await this.productInfoRepository.findOne({
      id: productReviewDto.productId,
    });
    const reviews = await this.reviewInfoRepository.find({
      where: { product: product },
      order: { updatedAt: 'DESC' },
    });

    const response = {
      result: result.affected,
      reviews: reviews,
    };

    return response;
  }

  async selectReview(productId: number): Promise<{
    product: ProductInfoEntity;
    reviews: Array<ReviewInfoEntity>;
  }> {
    const product = await this.productInfoRepository.findOne({ id: productId });
    const reviews = await this.reviewInfoRepository.find({
      where: { product: product },
      order: { updatedAt: 'DESC' },
    });

    const response = {
      product: product,
      reviews: reviews,
    };

    return response;
  }

  uploadImage(file: any): string {
    return 'SUCCESS';
  }
}

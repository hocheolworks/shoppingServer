import { Injectable } from '@nestjs/common';
import ProductInfoEntity from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SelectProductInfoDto } from './dtos/product-info.dto';
import { InputProductInfoDtd } from './dtos/input-product-info.dto';
import { InsertProductError } from './dtos/insert-product-error.dto';
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
  ): Promise<SelectProductInfoDto | InsertProductError> {
    // InputProductinfoDto Check

    try {
      const insertedId = await this.productInfoRepository
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
        .returning('id')
        .execute();

      return await this.productInfoRepository
        .createQueryBuilder('product')
        .where('id = :id', { id: insertedId })
        .getOne();
    } catch (err: any) {
      console.log(err);
      return null;
    }
  }
}

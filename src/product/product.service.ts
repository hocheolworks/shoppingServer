import { Injectable } from '@nestjs/common';
import ProductInfoEntity from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SelectProductInfoDto } from './dtos/product-info.dto';

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

  getProductById(id: number): Promise<SelectProductInfoDto> {
    return this.productInfoRepository
      .createQueryBuilder('product')
      .where('product.id = :id', { id: id })
      .leftJoinAndSelect('product.reviews', 'review_info')
      .leftJoinAndSelect('review_info.customer', 'customer_info')
      .getOne();
  }

  getProductsByIdList(data: Array<number>): Promise<SelectProductInfoDto[]> {
    console.log(data);
    return this.productInfoRepository
      .createQueryBuilder('product')
      .whereInIds(data)
      .getMany();
  }
}

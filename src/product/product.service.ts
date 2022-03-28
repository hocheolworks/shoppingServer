import { Injectable } from '@nestjs/common';
import ProductInfoEntity from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductInfoEntity)
    private readonly productInfoRepository: Repository<ProductInfoEntity>,
  ) {}
}

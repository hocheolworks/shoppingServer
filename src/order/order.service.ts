import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import OrderInfoEntity from './order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderInfoEntity)
    private readonly productInfoRepository: Repository<OrderInfoEntity>,
  ) {}
}

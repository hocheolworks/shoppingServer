import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import OrderInfoEntity from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderInfoEntity)
    private readonly orderInfoRepository: Repository<OrderInfoEntity>,
  ) {}
}

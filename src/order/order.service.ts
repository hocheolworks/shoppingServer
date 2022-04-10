import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SelectOrderInfoDto } from './dtos/order-info.dto';
import OrderInfoEntity from './entities/order.entity';
import axios from 'axios';
import { config } from 'process';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderInfoEntity)
    private readonly orderInfoRepository: Repository<OrderInfoEntity>,
  ) {}

  async getOrdersByCustomerId(
    customerId: number,
  ): Promise<SelectOrderInfoDto[]> {
    return this.orderInfoRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItem_info')
      .leftJoinAndSelect('orderItem_info.product', 'product_info')
      .where('order.customer.id = :id', { id: customerId })
      .getMany();
  }

  async paymentRequest(
    paymentKey: string,
    orderId: string,
    amount: number,
  ): Promise<Object> {
    const options = {
      method: 'POST',
      hostname: 'api.tosspayments.com',
      port: null,
      path: `/v1/payments/${paymentKey}`,
      headers: {
        Authorization:
          'Basic dGVzdF9za183WFpZa0tMNE1yallwZ1pvRFlvVjB6SndsRVdSOg==',
        'Content-Type': 'application/json',
      },
    };

    const http = require('https');
    const req = http.request(options, function (res) {
      const chunks = [];

      res.on('data', function (chunk) {
        chunks.push(chunk);
      });

      res.on('end', function () {
        const body = Buffer.concat(chunks);
        console.log(body.toString());
      });
    });

    req.write(JSON.stringify({ amount: amount, orderId: orderId }));

    return await req.end();
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ProductInfoEntity from 'src/product/entities/product.entity';
import { Repository } from 'typeorm';
import { InsertOrderInfoDto, SelectOrderInfoDto } from './dtos/order-info.dto';
import OrderInfoEntity from './entities/order.entity';
import OrderItemInfoEntity from './entities/orderItem.entity';
import http from 'https';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderInfoEntity)
    private readonly orderInfoRepository: Repository<OrderInfoEntity>,

    @InjectRepository(OrderItemInfoEntity)
    private readonly orderItemInfoRepository: Repository<OrderItemInfoEntity>,

    @InjectRepository(ProductInfoEntity)
    private readonly productInfoRepository: Repository<ProductInfoEntity>,
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
  ): Promise<any> {
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
  async insertOrders(
    insertOrderInfoDto: Partial<InsertOrderInfoDto>,
  ): Promise<OrderInfoEntity> {
    console.log(insertOrderInfoDto);

    const newOrderInfo = this.orderInfoRepository.create({
      customerId: insertOrderInfoDto.customerId,
      orderTotalPrice: insertOrderInfoDto.orderTotalPrice,
      orderMemo: insertOrderInfoDto.orderMemo,
      orderAddress: insertOrderInfoDto.orderAddress,
      orderAddressDetail: insertOrderInfoDto.orderAddressDetail,
      orderPostIndex: insertOrderInfoDto.orderPostIndex,
      orderCustomerName: insertOrderInfoDto.orderCustomerName,
      orderPhoneNumber: insertOrderInfoDto.orderPhoneNumber,
    });
    const result = await this.orderInfoRepository.save(newOrderInfo);

    const keyArray = Object.keys(insertOrderInfoDto.productsId);
    let val = 0;
    let key = 0;
    for (let i = 0; i < keyArray.length; i++) {
      key = parseInt(keyArray[i]);
      const product = await this.productInfoRepository.findOne({ id: key });

      val = insertOrderInfoDto.productsId[key];

      this.orderItemInfoRepository.save({
        orderItemEA: val,
        orderItemTotalPrice: key * val,
        order: newOrderInfo,
        product: product,
      });
    }

    return result;
  }

  async getOrderItemInfo(orderId: number) {
    return this.orderItemInfoRepository.find({ orderId: orderId });
  }

  async getOrderList() {
    return this.orderInfoRepository.find();
  }
}

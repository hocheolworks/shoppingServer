import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ProductInfoEntity from 'src/product/entities/product.entity';
import { Repository } from 'typeorm';
import { InsertOrderInfoDto, SelectOrderInfoDto } from './dtos/order-info.dto';
import OrderInfoEntity from './entities/order.entity';
import OrderItemInfoEntity from './entities/orderItem.entity';
import * as http from 'https';
import { CustomerService } from 'src/customer/customer.service';
import { TossPaymentResponse } from 'src/common/types/types';

function TossPaymentRequest(options, data) {
  return new Promise<TossPaymentResponse>((resolve, reject) => {
    const req = http.request(options, function (res) {
      const chunks = [];

      res.on('data', function (chunk) {
        chunks.push(chunk);
      });

      res.on('end', function () {
        const data = JSON.parse(Buffer.concat(chunks).toString());

        resolve({
          status: res.statusCode,
          data: data,
        });
        // 내가 필요한 부분
      });
    });
    req.on('error', (err) => {
      reject(err);
    });
    req.write(JSON.stringify(data));
    req.end();
  });
}

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderInfoEntity)
    private readonly orderInfoRepository: Repository<OrderInfoEntity>,

    @InjectRepository(OrderItemInfoEntity)
    private readonly orderItemInfoRepository: Repository<OrderItemInfoEntity>,

    @InjectRepository(ProductInfoEntity)
    private readonly productInfoRepository: Repository<ProductInfoEntity>,

    private readonly customerService: CustomerService,
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

  async getOrderByOrderId(orderId: number): Promise<SelectOrderInfoDto> {
    return this.orderInfoRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItem_info')
      .leftJoinAndSelect('orderItem_info.product', 'product_info')
      .where('order.id = :id', { id: orderId })
      .getOne();
  }

  async paymentRequest(
    paymentKey: string,
    tossOrderId: string,
    amount: number,
    insertOrder: Partial<InsertOrderInfoDto>,
  ): Promise<any> {
    const orderIdSplit: string[] = tossOrderId.split('-');
    const customerId: number = parseInt(orderIdSplit[1]);

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

    const data = {
      amount: amount,
      orderId: tossOrderId,
    };
    try {
      const response = await TossPaymentRequest(options, data);

      if (response.status === 200) {
        // 결제 성공
        await this.insertOrder(insertOrder, true);
        await this.customerService.clearCart(customerId);
      } else {
        console.log(response.data);
        throw new HttpException(response.data, response.status);
      }

      return response.data;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
  async insertOrder(
    insertOrderInfoDto: Partial<InsertOrderInfoDto>,
    isPaid: boolean,
  ): Promise<SelectOrderInfoDto> {
    try {
      const newOrderInfo = this.orderInfoRepository.create({
        customerId: insertOrderInfoDto.customerId,
        orderCustomerName: insertOrderInfoDto.orderCustomerName,
        orderPostIndex: insertOrderInfoDto.orderPostIndex,
        orderAddress: insertOrderInfoDto.orderAddress,
        orderAddressDetail: insertOrderInfoDto.orderAddressDetail,
        orderPhoneNumber: insertOrderInfoDto.orderPhoneNumber,
        orderMemo: insertOrderInfoDto.orderMemo,
        orderTotalPrice: insertOrderInfoDto.orderTotalPrice,
        orderStatus: isPaid ? '결제완료' : '결제대기',
        orderIsPaid: isPaid,
      });
      const result = await this.orderInfoRepository.save(newOrderInfo);
      const cart = insertOrderInfoDto.cart;

      for (let i = 0; i < cart.length; i++) {
        const cartItem = cart[i];
        const product = await this.productInfoRepository.findOne({
          id: cartItem.productId,
        });

        this.orderItemInfoRepository.save({
          orderItemEA: cartItem.productCount,
          orderItemTotalPrice: product.productPrice * cartItem.productCount,
          order: newOrderInfo,
          product: product,
        });
      }

      return result;
    } catch (err: any) {
      throw new InternalServerErrorException(err);
    }
  }

  async updateOrder(orderId: number): Promise<boolean> {
    return;
  }

  async getOrderItemInfo(orderId: number) {
    return this.orderItemInfoRepository.find({ orderId: orderId });
  }

  async getOrderList() {
    return await this.orderInfoRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItem_info')
      .leftJoinAndSelect('orderItem_info.product', 'product_info')
      .getMany();
  }

  async checkCustomerOrderItem(productId: number, customerId: number): Promise<Boolean> {
    const orderList = await this.orderInfoRepository.find({customerId: customerId});
    const product = await this.productInfoRepository.findOne({id: productId});
    
    let is_purchased = false;
    for(let i=0; i<orderList.length; i++) {
      const orderItemCount = await this.orderItemInfoRepository.count({ product: product, orderId: orderList[i].id});
      if (orderItemCount != 0) {
        is_purchased = true;
        break;
      }
    }
  
    return is_purchased;
  } 
}

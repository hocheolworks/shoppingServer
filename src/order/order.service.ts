import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InsertOrderInfoDto, SelectOrderInfoDto } from './dtos/order-info.dto';
import OrderInfoEntity from './entities/order.entity';
import OrderItemInfoEntity from './entities/orderItem.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderInfoEntity)
    private readonly orderInfoRepository: Repository<OrderInfoEntity>,
    
    @InjectRepository(OrderItemInfoEntity)
    private readonly orderItemInfoRepository: Repository<OrderItemInfoEntity>,
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

  async insertOrders(
    insertOrderInfoDto: Partial<InsertOrderInfoDto>,
  ): Promise<boolean>{

    console.log(insertOrderInfoDto);
    
    this.orderInfoRepository
    .createQueryBuilder('order_info')
    .insert()
    .into(OrderInfoEntity)
    .values({
      customerId: insertOrderInfoDto.customerId,
      orderTotalPrice : insertOrderInfoDto.orderTotalPrice,
      orderMemo: insertOrderInfoDto.orderMemo,
      orderAddress: insertOrderInfoDto.orderAddress,
      orderAddressDetail: insertOrderInfoDto.orderAddressDetail,
      orderPostIndex: insertOrderInfoDto.orderPostIndex,
      orderCustomerName: insertOrderInfoDto.orderCustomerName,
      orderPhoneNumber: insertOrderInfoDto.orderPhoneNumber,
    })
    .execute();

    let orderId = this.orderInfoRepository
    .createQueryBuilder('order')
    .select('order.id')
    .where('order.customerId = :id', {id: insertOrderInfoDto.customerId})
    .orderBy('createdAt')
    .getOne();

    let newOrderId = (await orderId).id;
    let keyArray = Object.keys(insertOrderInfoDto.productsId)
    let val =0;
    let key = 0;
    for(let i=0;i<keyArray.length; i++){
      key = parseInt(keyArray[i]);
      val = insertOrderInfoDto.productsId[key];
      console.log(key + ":" + val);
      this.orderItemInfoRepository
      .createQueryBuilder()
      .insert()
      .into(OrderItemInfoEntity)
      .values({
        productId: Number(key),
        orderId: newOrderId,
        orderItemEA: val,
        orderItemTotalPrice: key * val,  
      })
      .execute()
    }

    return true
  }


}

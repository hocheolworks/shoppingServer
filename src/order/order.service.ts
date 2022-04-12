import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ProductInfoEntity from 'src/product/entities/product.entity';
import { ManyToOne, Repository } from 'typeorm';
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

  async insertOrders(
    insertOrderInfoDto: Partial<InsertOrderInfoDto>,
  ): Promise<boolean>{

    console.log(insertOrderInfoDto);
    
    let newOrderInfo = this.orderInfoRepository.create({
      customerId: insertOrderInfoDto.customerId,
      orderTotalPrice : insertOrderInfoDto.orderTotalPrice,
      orderMemo: insertOrderInfoDto.orderMemo,
      orderAddress: insertOrderInfoDto.orderAddress,
      orderAddressDetail: insertOrderInfoDto.orderAddressDetail,
      orderPostIndex: insertOrderInfoDto.orderPostIndex,
      orderCustomerName: insertOrderInfoDto.orderCustomerName,
      orderPhoneNumber: insertOrderInfoDto.orderPhoneNumber,
    });
    const result = await this.orderInfoRepository.save(newOrderInfo);

    let keyArray = Object.keys(insertOrderInfoDto.productsId)
    let val =0;
    let key = 0;
    for(let i=0;i<keyArray.length; i++){
      key = parseInt(keyArray[i]);
      const product = await this.productInfoRepository.findOne({id:key});

      val = insertOrderInfoDto.productsId[key];
      
      this.orderItemInfoRepository.save({
        orderItemEA: val,
        orderItemTotalPrice: key *val,
        order: newOrderInfo,
        product: product,
      })
    }

    return true
  }
}

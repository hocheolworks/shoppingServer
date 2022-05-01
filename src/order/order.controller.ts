import OrderItemInfoEntity from 'src/order/entities/orderItem.entity';
import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
} from '@nestjs/common';
import { InsertOrderInfoDto, SelectOrderInfoDto } from './dtos/order-info.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('/all')
  async getOrderList() {
    return await this.orderService.getOrderList();
  }

  @Post('/success')
  async paymentRequest(
    @Body() query: { paymentKey: string; orderId: string; amount: number },
  ): Promise<any> {
    return await this.orderService.paymentRequest(
      query.paymentKey,
      query.orderId,
      query.amount,
    );
  }
  @Get('/:customerId')
  async getOrdersByCustomerId(
    @Param('customerId') customerId,
  ): Promise<SelectOrderInfoDto[]> {
    return await this.orderService.getOrdersByCustomerId(customerId);
  }

  @Get('item-list/:orderId')
  async getOrderItemInfo(
    @Param('orderId') orderId: number,
  ): Promise<OrderItemInfoEntity[]> {
    return await this.orderService.getOrderItemInfo(orderId);
  }

  @Post('/payment')
  async updateOrderList(
    @Body() insertOrderInfoDto: Partial<InsertOrderInfoDto>,
  ) {
    return this.orderService.insertOrders(insertOrderInfoDto);
  }

  @Post('/is-purchase')
  async checkPurchase(
    @Body('productId') productId: any,
    @Body('customerId') customerId: any,
  ): Promise<Boolean> {
    return this.orderService.checkCustomerOrderItem(productId, customerId);
  }
}

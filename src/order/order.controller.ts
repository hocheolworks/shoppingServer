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
import { PaymentService } from './payment.service';
import { VirtualAccountWebhookBody } from 'src/common/types/types';
import OrderInfoEntity from './entities/order.entity';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService,
  ) {}

  @Get('/all')
  async getOrderList() {
    return await this.orderService.getOrderList();
  }

  @Post('/payment')
  async paymentRequest(
    @Body()
    query: {
      paymentKey: string;
      orderId: string;
      amount: number;
      insertOrder: Partial<InsertOrderInfoDto>;
    },
  ): Promise<any> {
    return await this.orderService.paymentRequest(
      query.paymentKey,
      query.orderId,
      query.amount,
      query.insertOrder,
    );
  }

  @Get('item-list/:orderId')
  async getOrderItemInfo(
    @Param('orderId') orderId: number,
  ): Promise<OrderItemInfoEntity[]> {
    return await this.orderService.getOrderItemInfo(orderId);
  }

  @Post('/is-purchase')
  async checkPurchase(
    @Body('productId') productId: any,
    @Body('customerId') customerId: any,
  ): Promise<Boolean> {
    return this.orderService.checkCustomerOrderItem(productId, customerId);
  }

  @Get('/customer/:customerId')
  async getOrdersByCustomerId(
    @Param('customerId') customerId,
  ): Promise<SelectOrderInfoDto[]> {
    return await this.orderService.getOrdersByCustomerId(customerId);
  }

  @Get('/:orderId')
  async getOrderByOrderById(
    @Param('orderId') orderId,
  ): Promise<SelectOrderInfoDto> {
    return await this.orderService.getOrderByOrderId(orderId);
  }

  @Post('/payment/webhook/virtual-account')
  async webhookVirtualAccount(@Body() body: VirtualAccountWebhookBody) {
    await this.paymentService.receiveVirtualAccountWebhook(body);
    await this.orderService.updateOrderIsPaid(body.orderId, body.status);
  }
  
  @Post('/nonMember/orderList')
  async getNonMembersOrder(
    @Body('orderId') orderId,
    @Body('customerName') customerName,
    @Body('customerPhoneNumber') customerPhoneNumber,
  ) : Promise<any> {
    if (isNaN(orderId)){
      return -1;
    }
    return await this.orderService.searchNonMembersOrders(parseInt(orderId), customerName, customerPhoneNumber);
  }
}

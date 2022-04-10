import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SelectOrderInfoDto } from './dtos/order-info.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/success')
  async paymentRequest(
    @Body() query: { paymentKey: string; orderId: string; amount: number },
  ): Promise<Object> {
    return await this.orderService.paymentRequest(
      query.paymentKey,
      query.orderId,
      query.amount,
    );
  }
  @Get('/:customer_id')
  async getOrdersByCustomerId(
    @Param('customer_id') customerId,
  ): Promise<SelectOrderInfoDto[]> {
    return await this.orderService.getOrdersByCustomerId(customerId);
  }
}

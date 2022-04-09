import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InsertOrderInfoDto, SelectOrderInfoDto } from './dtos/order-info.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('/:customer_id')
  async getOrdersByCustomerId(
    @Param('customer_id') customerId,
  ): Promise<SelectOrderInfoDto[]> {
    return await this.orderService.getOrdersByCustomerId(customerId);
  }

  @Post('/payment')
  async updateOrderList(
    @Body() insertOrderInfoDto: Partial<InsertOrderInfoDto>
  ) {
    return this.orderService.insertOrders(insertOrderInfoDto);
  }
}

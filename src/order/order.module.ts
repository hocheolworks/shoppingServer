import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import OrderInfoEntity from './entities/order.entity';
import { OrderService } from './order.service';
import OrderItemInfoEntity from './entities/orderItem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderInfoEntity, OrderItemInfoEntity])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}

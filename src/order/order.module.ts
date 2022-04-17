import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import OrderInfoEntity from './entities/order.entity';
import { OrderService } from './order.service';
import OrderItemInfoEntity from './entities/orderItem.entity';
import ProductInfoEntity from 'src/product/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderInfoEntity, OrderItemInfoEntity, ProductInfoEntity])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}

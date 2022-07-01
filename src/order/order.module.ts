import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import OrderInfoEntity from './entities/order.entity';
import { OrderService } from './order.service';
import OrderItemInfoEntity from './entities/orderItem.entity';
import ProductInfoEntity from 'src/product/entities/product.entity';
import CartItemInfoEntity from 'src/customer/entities/cartItem.entity';
import { CustomerModule } from 'src/customer/customer.module';
import { PaymentService } from './payment.service';
import PaymentHistoryEntity from './entities/payment-history.entity';
import TaxBillInfoEntity from './entities/tax-bill-info.entity';
import OrderDesignFileInfoEntity from './entities/orderDesignFile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderInfoEntity,
      OrderItemInfoEntity,
      ProductInfoEntity,
      CartItemInfoEntity,
      PaymentHistoryEntity,
      TaxBillInfoEntity,
      OrderDesignFileInfoEntity,
    ]),
    CustomerModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, PaymentService],
  exports: [OrderService],
})
export class OrderModule {}

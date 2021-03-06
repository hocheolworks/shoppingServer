/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from './customer/customer.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { AuthModule } from './auth/auth.module';
import CustomerInfoEntity from './customer/entities/customer.entity';
import ProductInfoEntity from './product/entities/product.entity';
import OrderInfoEntity from './order/entities/order.entity';
import OrderItemInfoEntity from './order/entities/orderItem.entity';
import CartItemInfoEntity from './customer/entities/cartItem.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AccountModule } from './account/account.module';
import PaymentHistoryEntity from './order/entities/payment-history.entity';
import TaxBillInfoEntity from './order/entities/tax-bill-info.entity';

/**
 * ENV 설정
 */
const envFilePath = 'envs/.env.dev';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
    }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        CustomerInfoEntity,
        ProductInfoEntity,
        OrderInfoEntity,
        OrderItemInfoEntity,
        CartItemInfoEntity,
        PaymentHistoryEntity,
        TaxBillInfoEntity,
      ],
      synchronize: true,
      autoLoadEntities: true,
    }),
    CustomerModule,
    EmailModule,
    ProductModule,
    OrderModule,
    AuthModule,
    AccountModule,

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public/',
    }),

    AccountModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import ProductInfoEntity from './entities/product.entity';
import { ProductService } from './product.service';
import ReviewInfoEntity from './entities/review.entity';
import { CustomerService } from 'src/customer/customer.service';
import CustomerInfoEntity from 'src/customer/entities/customer.entity';
import { CustomerModule } from 'src/customer/customer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductInfoEntity, ReviewInfoEntity]),
    CustomerModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import CustomerInfoEntity from 'src/customer/customer.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerInfoEntity])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}

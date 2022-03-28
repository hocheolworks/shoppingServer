import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import ProductInfoEntity from './entities/product.entity';
import { ProductService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductInfoEntity])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}

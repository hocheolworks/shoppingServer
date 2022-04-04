import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import ProductInfoEntity from './entities/product.entity';
import { ProductService } from './product.service';
import ReviewInfoEntity from './entities/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductInfoEntity, ReviewInfoEntity])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}

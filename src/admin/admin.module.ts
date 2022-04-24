import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import CartItemInfoEntity from 'src/customer/entities/cartItem.entity';
import CustomerInfoEntity from 'src/customer/entities/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerInfoEntity, CartItemInfoEntity])],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}

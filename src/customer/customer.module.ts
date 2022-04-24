import { AuthService } from './../auth/auth.service';
/* eslint-disable prettier/prettier */
import { AuthModule } from './../auth/auth.module';
import { EmailModule } from './../email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import CustomerInfoEntity from './entities/customer.entity';
import CartItemInfoEntity from './entities/cartItem.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerInfoEntity, CartItemInfoEntity]),
    EmailModule,
    forwardRef(() => AuthModule),
  ],
  providers: [CustomerService],
  controllers: [CustomerController],
  exports: [CustomerService],
})
export class CustomerModule {}

/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import CustomerInfoEntity from './customer.entity';
@Module({
  imports: [TypeOrmModule.forFeature([CustomerInfoEntity])],
  providers: [CustomerService],
  controllers: [CustomerController],
})
export class CustomerModule {}

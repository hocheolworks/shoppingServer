/* eslint-disable prettier/prettier */
import { EmailModule } from './../email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import CustomerInfoEntity from './customer.entity';
@Module({
  imports: [TypeOrmModule.forFeature([CustomerInfoEntity]), EmailModule],
  providers: [CustomerService],
  controllers: [CustomerController],
})
export class CustomerModule {}

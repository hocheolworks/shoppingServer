/* eslint-disable prettier/prettier */
import { CreateCustomerInfoDto } from './dtos/create-customer-info.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CustomerService } from './customer.service';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async createAccount(
    @Body() createCustomerInfoDto: CreateCustomerInfoDto,
  ): Promise<boolean> {
    return await this.customerService.createAccount(createCustomerInfoDto);
  }
}

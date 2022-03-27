/* eslint-disable prettier/prettier */
import { NewCustomerInfo } from './customer.interface';
import { CreateCustomerInfoDto } from './dtos/create-customer-info.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CustomerService } from './customer.service';
@Controller('registration')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async createAccount(
    @Body() creatCustomerInfoDto: CreateCustomerInfoDto,
  ): Promise<NewCustomerInfo> {
    return await this.customerService.createAccount(creatCustomerInfoDto);
  }
}

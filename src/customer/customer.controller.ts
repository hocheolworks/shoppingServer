import { CustomerLogInDto } from './dtos/customer-login.dto';
/* eslint-disable prettier/prettier */
import { VerifyEmailDto } from './dtos/verify-email.dto';
import { NewCustomerInfo } from './customer.interface';
import { CreateCustomerInfoDto } from './dtos/create-customer-info.dto';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CustomerService } from './customer.service';
<<<<<<< HEAD

=======
>>>>>>> cc29c55ffa7983f84c32aaa73b7f7290dab7d18f
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async createAccount(
<<<<<<< HEAD
    @Body() createCustomerInfoDto: CreateCustomerInfoDto,
  ): Promise<boolean> {
    return await this.customerService.createAccount(createCustomerInfoDto);
=======
    @Body() creatCustomerInfoDto: CreateCustomerInfoDto,
  ): Promise<NewCustomerInfo> {
    return await this.customerService.createAccount(creatCustomerInfoDto);
>>>>>>> cc29c55ffa7983f84c32aaa73b7f7290dab7d18f
  }

  @Post('/email-verify')
  async verifyEmail(@Query() verifyEmaildto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = verifyEmaildto;

    return await this.customerService.verifyEmail(signupVerifyToken);
  }

  @Post('/login')
  async login(@Body() customerLogInDto: CustomerLogInDto): Promise<string> {
    return await this.customerService.login(customerLogInDto);
  }
}

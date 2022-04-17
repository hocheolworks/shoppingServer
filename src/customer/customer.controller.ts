import { LoginRequestDto } from './../auth/dtos/login.request.dto';
import { AuthService } from './../auth/auth.service';
import { CustomerLogInDto } from './dtos/customer-login.dto';
/* eslint-disable prettier/prettier */
import { VerifyEmailDto } from './dtos/verify-email.dto';
import { NewCustomerInfo } from './customer.interface';
import { CreateCustomerInfoDto } from './dtos/create-customer-info.dto';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CustomerService } from './customer.service';
@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async createAccount(
    @Body() createCustomerInfoDto: CreateCustomerInfoDto,
  ): Promise<NewCustomerInfo> {
    return await this.customerService.createAccount(createCustomerInfoDto);
  }

  @Post('/email-verify')
  async verifyEmail(@Query() verifyEmaildto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = verifyEmaildto;

    return await this.customerService.verifyEmail(signupVerifyToken);
  }

  @Post('/login')
  async login(@Body() loginRequestDto: LoginRequestDto) {
    return await this.authService.jwtLogIn(loginRequestDto);
  }
}

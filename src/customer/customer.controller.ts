import { KakaoLogInDto } from './../auth/dtos/kakaologin.dto';
import { LoginRequestDto } from './../auth/dtos/login.request.dto';
import { AuthService } from './../auth/auth.service';
import { CustomerLogInDto } from './dtos/customer-login.dto';
/* eslint-disable prettier/prettier */
import { VerifyEmailDto } from './dtos/verify-email.dto';
import { NewCustomerInfo } from './customer.interface';
import { CreateCustomerInfoDto } from './dtos/create-customer-info.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import {
  InputCartItemInfoDto,
  SelectCartItemInfoDto,
} from './dtos/cartItem-info.dto';
import { CustomerInfoDto } from './dtos/customer-info.dto';
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
  async verifyEmail(
    @Body() createCustomerInfoDto: CreateCustomerInfoDto,
  ): Promise<NewCustomerInfo> {
    return await this.customerService.emailValidation(createCustomerInfoDto);
  }

  @Post('/login')
  async login(@Body() loginRequestDto: LoginRequestDto) {
    return await this.authService.jwtLogIn(loginRequestDto);
  }

  @Get('/kakao/login')
  async kakaoLogin(@Query() code: string) {
    console.log('kakaologin was called');
    const result = await this.authService.kakaoLogin(code);
    console.log(result.subscribe());
    return result;
  }

  @Get('/:customerId')
  async getCustomerByCustomerId(
    @Param('customerId') customerId: number,
  ): Promise<CustomerInfoDto> {
    return await this.customerService.getCustomerByCustomerId(customerId);
  }

  @Get('/:customerId/cart')
  async getCartItems(
    @Param('customerId') customerId,
  ): Promise<SelectCartItemInfoDto[]> {
    return await this.customerService.getCartItems(customerId);
  }

  @Put('/:customerId/cart')
  async updateCartItem(
    @Param('customerId') customerId,
    @Body() inputCartItemData: InputCartItemInfoDto,
  ): Promise<SelectCartItemInfoDto[]> {
    return await this.customerService.updateCartItem(
      customerId,
      inputCartItemData,
    );
  }

  @Post('/:customerId/cart')
  async insertCartItem(
    @Param('customerId') customerId,
    @Body() inputCartItemData: InputCartItemInfoDto,
  ): Promise<SelectCartItemInfoDto[]> {
    return await this.customerService.insertCartItem(
      customerId,
      inputCartItemData,
    );
  }

  @Delete('/:customerId/cart')
  async deleteCartItem(
    @Param('customerId') customerId,
    @Query('productId') productId,
  ): Promise<SelectCartItemInfoDto[]> {
    return await this.customerService.deleteCartItem(customerId, productId);
  }

  @Delete('/:customerId/cart/all')
  async clearCart(
    @Param('customerId') customerId,
  ): Promise<SelectCartItemInfoDto[]> {
    return await this.customerService.clearCart(customerId);
  }
}

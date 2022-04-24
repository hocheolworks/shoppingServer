import { response } from 'express';
import { KakaoLogInDto } from './dtos/kakaologin.dto';
import { LoginRequestDto } from './dtos/login.request.dto';
import { Repository } from 'typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import CustomerInfoEntity from 'src/customer/entities/customer.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(CustomerInfoEntity)
    private readonly customerInfoRepository: Repository<CustomerInfoEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async jwtLogIn(loginRequestDto: LoginRequestDto) {
    const { customerEmail, customerPassword } = loginRequestDto;

    const customer = await this.customerInfoRepository.findOne({
      customerEmail,
    });

    if (!customer) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요');
    }

    const isPasswordValid: boolean = await bcrypt.compare(
      customerPassword,
      customer.customerPassword,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요');
    }

    const payload = { email: customerEmail, sub: customer.customerName };

    const token = this.jwtService.sign(payload);
    const response = {
      id: customer.id,
      customerEmail: customer.customerEmail,
      customerName: customer.customerName,
      customerPhoneNumber: customer.customerPhoneNumber,
      customerPostIndex: customer.customerPostIndex,
      customerAddress: customer.customerAddress,
      customerAddressDetail: customer.customerAddressDetail,
      customerRole: customer.customerRole,
      token: token,
    };

    return response;
  }

  async kakaoLogin(code: any): Promise<Partial<CustomerInfoEntity> | boolean> {
    const getAccessTokenBody = {
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    };
    const codeFromObject = code['code '];
    const getAccessTokenUrl = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${process.env.REST_API_KEY}&redirect_uri=${process.env.REDIRECT_URL}&code=${codeFromObject}`;

    const tokenData = await (
      await axios.post(getAccessTokenUrl, getAccessTokenBody)
    ).data;
    console.log(tokenData);

    const accessToken = tokenData.access_token;

    const getCustomerInfoUrl = `https://kapi.kakao.com/v2/user/me`;
    const getCustomerInfoBody = {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const customerInfo = await (
      await axios.get(getCustomerInfoUrl, getCustomerInfoBody)
    ).data;

    console.log(customerInfo);

    if (customerInfo.kakao_account.has_email) {
      const email = customerInfo.kakao_account.email;
      const customer = await this.customerInfoRepository.findOne({
        customerEmail: email,
      });

      if (customer) {
        console.log(customer);
        const token = accessToken;
        const response = {
          id: customer.id,
          customerEmail: customer.customerEmail,
          customerName: customer.customerName,
          customerPhoneNumber: customer.customerPhoneNumber,
          customerPostIndex: customer.customerPostIndex,
          customerAddress: customer.customerAddress,
          customerAddressDetail: customer.customerAddressDetail,
          customerRole: customer.customerRole,
          token: token,
        };

        return response;
      } else {
        return false;
      }
    }
  }
}

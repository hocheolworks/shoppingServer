import { KakaoLogInDto } from './dtos/kakaologin.dto';
import { LoginRequestDto } from './dtos/login.request.dto';
import { Repository } from 'typeorm';
import {
  Get,
  Injectable,
  NotFoundException,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import CustomerInfoEntity from 'src/customer/entities/customer.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { Observable, lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { map, tap } from 'rxjs/operators';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(CustomerInfoEntity)
    private readonly customerInfoRepository: Repository<CustomerInfoEntity>,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
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

  async kakaoLogin(code: any): Promise<AxiosResponse<any, any>> {
    const getAccessTokenBody = {
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    };
    const codeFromObject = code['code '];
    const getAccessTokenUrl = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${process.env.REST_API_KEY}&redirect_uri=${process.env.REDIRECT_URL}&code=${codeFromObject}`;

    const accessTokenRequest = this.httpService.post(
      getAccessTokenUrl,
      getAccessTokenBody,
    );

    const getAccessTokenResult = await (
      await lastValueFrom(accessTokenRequest)
    ).data;

    const accessToken = getAccessTokenResult.access_token;
    const tokenType = getAccessTokenResult.token_type;
    console.log(tokenType, accessToken);

    const getCustomerInfoUrl = `https://kapi.kakao.com/v2/user/me`;

    return accessToken;
  }
}

// export class KakaoLogin {
//   check: boolean;
//   accessToken: string;
//   private http: HttpService;
//   constructor() {
//     this.check = false;
//     this.http = new HttpService();
//     this.accessToken = '';
//   }
//   loginCheck(): void {
//     this.check = !this.check;
//     return;
//   }
//   async login(url: string, headers: any): Promise<any> {
//     return await this.http.post(url, '', { headers }).toPromise();
//   }
//   setToken(token: string): boolean {
//     this.accessToken = token;
//     return true;
//   }
//   async logout(): Promise<any> {
//     const _url = 'https://kapi.kakao.com/v1/user/logout';
//     const _header = {
//       Authorization: `bearer ${this.accessToken}`,
//     };
//     return await this.http.post(_url, '', { headers: _header }).toPromise();
//   }
//   async deleteLog(): Promise<any> {
//     const _url = 'https://kapi.kakao.com/v1/user/unlink';
//     const _header = {
//       Authorization: `bearer ${this.accessToken}`,
//     };
//     return await this.http.post(_url, '', { headers: _header }).toPromise();
//   }
// }

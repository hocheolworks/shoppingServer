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
import { Observable } from 'rxjs';
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
      customerRole: customer.customerRole,
      token: token,
    };

    return response;
  }

  async kakaoLogin(code: string): Promise<Observable<AxiosResponse<any, any>>> {
    const body = {
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    };

    const result = this.httpService
      .post(
        `https://kauth.kakao.com/oauth/token/?grant_type=authorization_code&client_id=${process.env.REST_API_KEY}&redirect_uri=${process.env.REDIRECT_URL}&code=${code}`,
      )
      .pipe(
        map((resp) => resp.data),
        tap((data) => console.log(data)),
      );
    console.log(result.subscribe);

    return result;
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

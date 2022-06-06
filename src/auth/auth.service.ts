import { NewCustomerInfo } from './../customer/customer.interface';
import { VerifyPhoneDto } from './../customer/dtos/verify-phone.dto';
import { response } from 'express';
import { LoginRequestDto } from './dtos/login.request.dto';
import { Repository } from 'typeorm';
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import CustomerInfoEntity from 'src/customer/entities/customer.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(CustomerInfoEntity)
    private readonly customerInfoRepository: Repository<CustomerInfoEntity>,
    private readonly jwtService: JwtService,
  ) {}

  private makeSignature(): string {
    const message = [];
    const hmac = crypto.createHmac('sha256', process.env.IAM_SECRET_KEY);
    const space = ' ';
    const newLine = '\n';
    const method = 'POST';
    const timestamp = Date.now().toString();
    message.push(method);
    message.push(space);
    message.push(`/sms/v2/services/${process.env.SMS_ID}/messages`);
    message.push(newLine);
    message.push(timestamp);
    message.push(newLine);
    message.push(process.env.IAM_ACCESS_KEY);
    //message 배열에 위의 내용들을 담아준 후에
    console.log(message.join(''));
    const signature = hmac.update(message.join('')).digest('base64');
    //message.join('') 으로 만들어진 string 을 hmac 에 담고, base64로 인코딩한다
    return signature.toString(); // toString()이 없었어서 에러가 자꾸 났었는데, 반드시 고쳐야함.
  }

  async sendSMS(verifyPhoneDto: VerifyPhoneDto) {
    const { customerPassword, customerPassword2, customerEmail } =
      verifyPhoneDto;

    const customerPhoneNumber = verifyPhoneDto.customerPhoneNumber;
    if (customerPhoneNumber.length >= 12) {
      throw new BadRequestException(
        '- 를 제외하고 입력해주세요! ex) 01012345678',
      );
    }

    const verifyNumber = verifyPhoneDto.verifyNumber;

    if (customerPassword === customerPassword2) {
      if (await this.customerInfoRepository.count({ customerPhoneNumber })) {
        throw new BadRequestException('이미 가입된 회원입니다.');
      }
      if (await this.customerInfoRepository.count({ customerEmail })) {
        throw new BadRequestException('중복된 아이디(이메일) 입니다.');
      }

      const body = {
        type: 'SMS',
        contentType: 'COMM',
        countryCode: '82',
        from: process.env.SMS_SENDER,
        content: `진솔유통 인증번호: ${verifyNumber} \n정확하게 입력해주세요!`,
        messages: [
          {
            to: customerPhoneNumber,
          },
        ],
      };
      const options = {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'x-ncp-apigw-timestamp': Date.now().toString(),
          'x-ncp-iam-access-key': process.env.IAM_ACCESS_KEY,
          'x-ncp-apigw-signature-v2': this.makeSignature(),
        },
      };

      console.log(options);

      console.log(body);

      const result = await axios.post(
        `https://sens.apigw.ntruss.com/sms/v2/services/${process.env.SMS_ID}/messages`,
        body,
        options,
      );

      console.log(result);

      return body;
    } else {
      throw new BadRequestException('비밀번호가 확인용 비밀번호와 다릅니다.');
    }
  }

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

    const codeFromObject = code['code '].trim();
    console.log(codeFromObject);
    const getAccessTokenUrl = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${process.env.REST_API_KEY}&redirect_uri=${process.env.REDIRECT_URL}&code=${codeFromObject}`;
    console.log(getAccessTokenUrl);
    const res = await axios.post(getAccessTokenUrl, getAccessTokenBody);

    console.log(res);
    const tokenData = res.data;
    const accessToken = tokenData.access_token;

    const getCustomerInfoUrl = `https://kapi.kakao.com/v2/user/me`;
    const getCustomerInfoBody = {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const customerInfo: any = await axios
      .get(getCustomerInfoUrl, getCustomerInfoBody)
      .catch((e) => {
        console.log(e);
      });

    console.log('customerInfo >>>>>>>>>>>>>>>>>>', customerInfo);

    if (customerInfo.data.kakao_account.has_email) {
      const email = customerInfo.data.kakao_account.email;
      const customer = await this.customerInfoRepository.findOne({
        customerEmail: email,
      });

      console.log('customer', customer);

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
        const token = accessToken;
        const newCustomerInfo: NewCustomerInfo = {
          customerEmail: customerInfo.data.kakao_account.email,
          customerPassword: null,
          customerName: null,
          customerPhoneNumber: null,
          signupVerifyToken: null,
        };
        await this.customerInfoRepository.insert(newCustomerInfo);
        const customer = await this.customerInfoRepository.findOne({
          customerEmail: email,
        });

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
    } else {
      return false;
    }
  }
}

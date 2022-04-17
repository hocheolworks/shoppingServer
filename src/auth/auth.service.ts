import { LoginRequestDto } from './dtos/login.request.dto';
import { Repository } from 'typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import CustomerInfoEntity from 'src/customer/entities/customer.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(CustomerInfoEntity)
    private readonly customerInfoRepository: Repository<CustomerInfoEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async jwtLogIn(loginRequestDto: LoginRequestDto) {
    const { customerEmail, customerPassword } = loginRequestDto;

    console.log('입력정보');
    console.log(loginRequestDto);

    const customer = await this.customerInfoRepository.findOne({
      customerEmail,
    });

    console.log('이메일 찾기');
    console.log(customer);

    if (!customer) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요');
    }

    // console.log('here we are!!');
    // const saltOrRounds = 10;
    // const encryptedPassword = await bcrypt.hash(customerPassword, saltOrRounds);
    // console.log(encryptedPassword);

    console.log('here we are');
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
}

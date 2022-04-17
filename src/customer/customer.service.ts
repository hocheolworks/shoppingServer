/* eslint-disable prettier/prettier */
import { CustomerLogInDto } from './dtos/customer-login.dto';
import { SendEmailDto } from './../email/dtos/send-email.dto';
import { EmailService } from './../email/email.service';
import { NewCustomerInfo } from './customer.interface';
import { CreateCustomerInfoDto } from './dtos/create-customer-info.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import CustomerInfoEntity from './entities/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import customerConstants from './customer.constants';

import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerInfoEntity)
    private readonly customerInfoRepository: Repository<CustomerInfoEntity>,
    private readonly emailService: EmailService,
  ) {}

  async emailValidation(
    createCustomerInfoDto: CreateCustomerInfoDto,
  ): Promise<any> {
    const { customerEmail, customerPassword, customerPassword2, customerName } =
      createCustomerInfoDto;

    const verifyNumber = createCustomerInfoDto.verifyNumber;

    if (customerPassword === customerPassword2) {
      if (await this.customerInfoRepository.count({ customerEmail })) {
        throw new BadRequestException('이미 가입된 이메일입니다.');
      }

      const registrationEmailData: SendEmailDto = {
        from: '일진유통 slogupemailmoduletest@gmail.com', //TODO 하드코딩
        to: customerEmail,
        title: '일진유통 회원가입 확인 안내',
        customerName: customerName,
      };

      this.sendCustomerJoinEmail(registrationEmailData, verifyNumber);
    }
  }

  async createAccount(
    createCustomerInfoDto: CreateCustomerInfoDto,
  ): Promise<NewCustomerInfo> {
    const {
      customerEmail,
      customerPassword,
      customerPassword2,
      customerName,
      customerPhoneNumber,
    } = createCustomerInfoDto;

    const signupVerifyToken = uuid.v1();

    //회원가입 로직
    if (customerPassword === customerPassword2) {
      let newCustomerInfo: NewCustomerInfo = {
        customerEmail,
        customerPassword,
        customerName,
        customerPhoneNumber,
        signupVerifyToken,
      };

      if (await this.customerInfoRepository.count({ customerEmail })) {
        throw new BadRequestException('이미 가입된 이메일입니다.');
      }

      const saltOrRounds = 10;
      const encryptedPassword = await bcrypt.hash(
        customerPassword,
        saltOrRounds,
      );
      newCustomerInfo.customerPassword = encryptedPassword;

      newCustomerInfo = this.customerInfoRepository.create(newCustomerInfo);
      const result = await this.customerInfoRepository.save(newCustomerInfo);

      return result;
    }
  }

  async login(customerLogInDto: CustomerLogInDto): Promise<string> {
    const customer = await this.customerInfoRepository.findOne(
      customerLogInDto.customerEmail,
    );

    if (!customer) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }

    return await this.getLogInToken({
      customerEmail: customer.customerEmail,
      customerPassword: customer.customerPassword,
    });
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    // 1. DB에서 signupVerifyToken으로 이미 가입한 유저가 있는지 조회하고 없다면 에러 처리
    // 2. JWT

    const customer = await this.customerInfoRepository.findOne({
      signupVerifyToken,
    });

    if (!customer) {
      throw new NotFoundException(
        customerConstants.errorMessages.USER_NOT_FOUND,
      );
    }

    return await this.getLogInToken({
      customerEmail: customer.customerEmail,
      customerPassword: customer.customerPassword,
    });
  }

  private async getLogInToken(
    customerLogInDto: CustomerLogInDto,
  ): Promise<string> {
    // 1. email, password를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러 처리
    // 2. JWT
    const customerEmail = customerLogInDto.customerEmail;
    console.log('JWT 토큰 발급');

    if (!(await this.customerInfoRepository.count({ customerEmail }))) {
      throw new BadRequestException(
        customerConstants.errorMessages.USER_NOT_FOUND,
      );
    }

    const payload = { ...customerLogInDto };

    const result = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1d',
      audience: 'example.com',
      issuer: 'example.com',
    });

    console.log(result);
    return result;
  }

  private async sendCustomerJoinEmail(
    sendEmailDto: SendEmailDto,
    verifyNumber: number,
  ) {
    return await this.emailService.sendCustomerJoinEmail(
      sendEmailDto,
      verifyNumber,
    );
  }
}

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
import CartItemInfoEntity from './entities/cartItem.entity';
import {
  InputCartItemInfoDto,
  SelectCartItemInfoDto,
} from './dtos/cartItem-info.dto';
import { CustomerInfoDto } from './dtos/customer-info.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerInfoEntity)
    private readonly customerInfoRepository: Repository<CustomerInfoEntity>,
    @InjectRepository(CartItemInfoEntity)
    private readonly cartItemInfoRepository: Repository<CartItemInfoEntity>,
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
        from: '일조유통 iljotradingcompany@gmail.com',
        to: customerEmail,
        title: '일조유통 회원가입 확인 안내',
        customerName: customerName,
      };

      const result = await this.sendCustomerJoinEmail(
        registrationEmailData,
        verifyNumber,
      );

      console.log(result);

      return result;
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

    return result;
  }

  private async sendCustomerJoinEmail(
    sendEmailDto: SendEmailDto,
    verifyNumber: number,
  ) {
    console.log('here');

    const result = await this.emailService.sendCustomerJoinEmail(
      sendEmailDto,
      verifyNumber,
    );

    console.log(result);
    return result;
  }

  async checkAdmin(customerId: number): Promise<boolean> {
    const { customerRole } = await this.customerInfoRepository
      .createQueryBuilder('customer')
      .select('customerRole')
      .where('customer.id = :customerId', { customerId: customerId })
      .getRawOne();

    return customerRole === 'ADMIN';
  }

  async getCustomerByCustomerId(customerId: number): Promise<CustomerInfoDto> {
    return await this.customerInfoRepository
      .createQueryBuilder('customer')
      .where('customer.id = :customerId', { customerId: customerId })
      .getOne();
  }

  async getCartItems(customerId: number): Promise<SelectCartItemInfoDto[]> {
    if (customerId === undefined || isNaN(customerId)) return null;

    return await this.cartItemInfoRepository
      .createQueryBuilder('cartItem')
      .leftJoinAndSelect('cartItem.customer', 'customer_info')
      .leftJoinAndSelect('cartItem.product', 'product_info')
      .where('cartItem.customerId = :customerId', { customerId: customerId })
      .getMany();
  }

  async updateCartItem(
    customerId: number,
    inputCartItemData: InputCartItemInfoDto,
  ): Promise<SelectCartItemInfoDto[]> {
    await this.cartItemInfoRepository
      .createQueryBuilder()
      .update(CartItemInfoEntity)
      .set({
        productCount: inputCartItemData.productCount,
      })
      .where('customerId = :customerId', { customerId: customerId })
      .andWhere('productId = :productId', {
        productId: inputCartItemData.productId,
      })
      .execute();

    return await this.getCartItems(customerId);
  }

  async insertCartItem(
    customerId: number,
    inputCartItemData: InputCartItemInfoDto,
  ): Promise<SelectCartItemInfoDto[]> {
    await this.cartItemInfoRepository
      .createQueryBuilder()
      .insert()
      .into(CartItemInfoEntity)
      .values({
        customerId: customerId,
        productId: inputCartItemData.productId,
        productCount: inputCartItemData.productCount,
      })
      .execute();

    return await this.getCartItems(customerId);
  }

  async deleteCartItem(
    customerId: number,
    productId: number,
  ): Promise<SelectCartItemInfoDto[]> {
    await this.cartItemInfoRepository
      .createQueryBuilder()
      .delete()
      .from(CartItemInfoEntity)
      .where('customerId = :customerId', { customerId: customerId })
      .andWhere('productId = :productId', { productId: productId })
      .execute();

    return await this.getCartItems(customerId);
  }

  async clearCart(customerId: number): Promise<SelectCartItemInfoDto[]> {
    await this.cartItemInfoRepository
      .createQueryBuilder()
      .delete()
      .from(CartItemInfoEntity)
      .where('customerId = :customerId', { customerId: customerId })
      .execute();

    return await this.getCartItems(customerId);
  }

  async getCustomerList() {
    console.log('we are here');
    const customerList = await this.customerInfoRepository.find();
    console.log('this is list', customerList);
    return customerList;
  }

  async getCustomerInfoById(customerId: number): Promise<CustomerInfoEntity> {
    return await this.customerInfoRepository.findOne({ id: customerId });
  }
}

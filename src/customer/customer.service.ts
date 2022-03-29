/* eslint-disable prettier/prettier */
import { NewCustomerInfo } from './customer.interface';
import { CreateCustomerInfoDto } from './dtos/create-customer-info.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import CustomerInfoEntity from './customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerInfoEntity)
    private readonly customerInfoRepository: Repository<CustomerInfoEntity>,
  ) {}

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

    const token = uuid.v1();

    //회원가입 로직
    if (customerPassword === customerPassword2) {
      let newCustomerInfo: NewCustomerInfo = {
        customerEmail,
        customerPassword,
        customerName,
        customerPhoneNumber,
        token,
      };

      if (await this.customerInfoRepository.count({ customerEmail })) {
        console.log('duplicated email inserted');
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
      console.log(result);

      return result;
    }
  }

  async printHello() {
    return { msg: 'hello' };
  }
}

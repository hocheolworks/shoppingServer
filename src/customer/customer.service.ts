/* eslint-disable prettier/prettier */
import { NewCustomerInfo } from './customer.interface';
import { CreateCustomerInfoDto } from './dtos/create-customer-info.dto';
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import CustomerInfoEntity from './entities/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerInfoEntity)
    private readonly customerInfoRepository: Repository<CustomerInfoEntity>,
  ) {}

  async createAccount(
    createCustomerInfoDto: CreateCustomerInfoDto,
  ): Promise<boolean> {
    console.log(createCustomerInfoDto);
    const {
      customerEmail,
      customerPassword,
      customerPassword2,
      customerName,
      customerPhoneNumber,
    } = createCustomerInfoDto;
    //회원가입 로직
    if (customerPassword === customerPassword2) {
      let newCustomerInfo: NewCustomerInfo = {
        customerEmail,
        customerPassword,
        customerName,
        customerPhoneNumber,
      };
      newCustomerInfo = this.customerInfoRepository.create(newCustomerInfo);

      const result = await this.customerInfoRepository
        .save(newCustomerInfo)
        .catch((e) => {
          console.log(e);
        });
      console.log(result);
    }

    return true;
  }

  async printHello() {
    return { msg: 'hello' };
  }
}

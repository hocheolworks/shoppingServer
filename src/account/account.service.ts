import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CustomerInfoEntity from 'src/customer/entities/customer.entity';
import { Repository } from 'typeorm';
import { UpdateAccountInfoDto } from './dtos/update-account-info.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(CustomerInfoEntity)
    private readonly customerInfoRepository: Repository<CustomerInfoEntity>,
  ) {}

  async updateCustomerInfo(
    updateAccountInfoDto: UpdateAccountInfoDto,
  ): Promise<CustomerInfoEntity>{
   
    const customer = await this.customerInfoRepository.findOne(updateAccountInfoDto.id);
   
    customer.customerName = updateAccountInfoDto.customerName;
    customer.customerPostIndex = updateAccountInfoDto.customerPostIndex;
    customer.customerAddress = updateAccountInfoDto.customerAddress;
    customer.customerAddressDetail = updateAccountInfoDto.customerAddressDetail;
    customer.customerPhoneNumber = updateAccountInfoDto.customerPhoneNumber;
    customer.updatedAt = new Date();
   
    await this.customerInfoRepository.save(customer);
   
    return customer;
  }
}

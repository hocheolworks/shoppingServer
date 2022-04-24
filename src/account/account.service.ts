import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import CustomerInfoEntity from 'src/customer/entities/customer.entity';
import { Repository } from 'typeorm';
import { ConfrimPasswordDto } from './dtos/confirm-password.dto';
import { UpdateAccountInfoDto } from './dtos/update-account-info.dto';
import * as bcrypt from 'bcrypt';
import { UpdatePasswordDto } from './dtos/update-password.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(CustomerInfoEntity)
    private readonly customerInfoRepository: Repository<CustomerInfoEntity>,
    private readonly jwtService: JwtService,
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

  async confirmCustomerPassword(
    confirmPasswordDto: ConfrimPasswordDto,
  ): Promise<string> {
    const { customerEmail, customerPassword } = confirmPasswordDto;
    const customer = await this.customerInfoRepository.findOne({customerEmail});
    console.log(customer);
    

    const isPasswordValid: boolean = await bcrypt.compare(
      customerPassword,
      customer.customerPassword,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('비밀번호를 확인해주세요');
    } else {
      return '비밀번호 확인 성공';
    }
  }

  async changeCustomerPassword(
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<string> {
    const { email, password, password2 } = updatePasswordDto;
    if (password != password2) {
      throw new UnauthorizedException('비밀번호와 비밀번호확인이 다릅니다.');
    }

    const customer = await this.customerInfoRepository.findOne({customerEmail: email});
    
    console.log(customer);
    
    const saltOrRounds = 10;
    const encryptedPassword = await bcrypt.hash(
      password,
      saltOrRounds,
    );
    customer.customerPassword = encryptedPassword;
    customer.updatedAt = new Date();
    const result = await this.customerInfoRepository.save(customer);

    return '업데이트 성공';
  }
}

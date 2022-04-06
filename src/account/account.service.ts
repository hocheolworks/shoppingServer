import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EditCusromerInfoDto } from './dtos/edit-customer-info.dto';
import AccountInfoEntity from './entities/account.entitiy';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(AccountInfoEntity)
        private readonly accountInfoRepository: Repository<AccountInfoEntity>,
    ) {}

    async printHello(
        editCustomerInfoDto: EditCusromerInfoDto,
    ): Promise<string> {
        console.log('Hellooooooooooo');
        return 'hello';
    }
}

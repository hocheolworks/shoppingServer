import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { AccountService } from './account.service';
import { EditCusromerInfoDto } from './dtos/edit-customer-info.dto';

@Controller('account')
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @Put('/edit')
    async editCustomerInfo(
        @Body() editCustomerInfoDto: EditCusromerInfoDto,
    ): Promise<string> {
        console.log('abcdefg');
        return await this.accountService.printHello(editCustomerInfoDto);
    }
}

import { Body, Controller, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import { EditCusromerInfoDto } from './dtos/edit-customer-info.dto';

@Controller('account')
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @Post('/user/edit')
    async editCustomerInfo(
        @Body() editCustomerInfoDto: EditCusromerInfoDto,
    ): Promise<string> {
        return await this.accountService.printHello(editCustomerInfoDto);
    }
}

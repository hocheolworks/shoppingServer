import { Body, Controller, Put } from '@nestjs/common';
import CustomerInfoEntity from 'src/customer/entities/customer.entity';
import { AccountService } from './account.service';
import { UpdateAccountInfoDto } from './dtos/update-account-info.dto';

@Controller('account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService
  ){};

  @Put('/edit')
  async updateAccount(
    @Body() updateAccountInfoDto: UpdateAccountInfoDto,
  ): Promise<CustomerInfoEntity> {

    // console.log(updateAccountInfoDto);
    return this.accountService.updateCustomerInfo(updateAccountInfoDto);
  }
}

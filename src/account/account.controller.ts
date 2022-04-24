import { Body, Controller, Put } from '@nestjs/common';
import CustomerInfoEntity from 'src/customer/entities/customer.entity';
import { AccountService } from './account.service';
import { ConfrimPasswordDto } from './dtos/confirm-password.dto';
import { UpdateAccountInfoDto } from './dtos/update-account-info.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Put('/edit')
  async updateAccount(
    @Body() updateAccountInfoDto: UpdateAccountInfoDto,
  ): Promise<CustomerInfoEntity> {
    // console.log(updateAccountInfoDto);
    return this.accountService.updateCustomerInfo(updateAccountInfoDto);
  }

  @Put('/password-confirm')
  async confirmPassword(
    @Body() confirmPasswordDto: ConfrimPasswordDto,
  ): Promise<string> {
    // console.log(confirmPasswordDto);
    return this.accountService.confirmCustomerPassword(confirmPasswordDto);
  }

  @Put('/password-change')
  async changePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<string> {
    // console.log(updatePasswordDto);
    return this.accountService.changeCustomerPassword(updatePasswordDto);
  }
}
